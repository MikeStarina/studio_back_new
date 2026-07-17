import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { readFile } from "fs/promises";
import { UploadedFile } from "express-fileupload";
import blog from "../models/blog";
import ServerError from "../utils/server-error-class";
import {
  getBlogCoversPrefix,
  deleteObjectByKey,
  keyFromCdnUrl,
  uploadBlogCoverObject,
} from "../utils/yandex-storage";

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const isValidationError = (err: unknown): boolean =>
  Boolean(
    err &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name: string }).name === "ValidationError"
  );

const safeDeleteStorageUrl = async (url?: string | null) => {
  const key = url ? keyFromCdnUrl(url) : null;
  if (!key) return;
  try {
    await deleteObjectByKey(key);
  } catch (err) {
    console.error("Failed to delete blog cover from storage:", err);
  }
};

const formatCreatedAt = (date = new Date()) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const normalizeHashtags = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter(Boolean);
};

const assertBlogBody = (body: Record<string, unknown>, partial = false) => {
  if (!partial || "title" in body) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) throw ServerError.error400("title обязателен");
  }
  if (!partial || "slug" in body) {
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    if (!slug) throw ServerError.error400("slug обязателен");
  }
  if (!partial || "cover" in body) {
    const cover = typeof body.cover === "string" ? body.cover.trim() : "";
    if (!cover) throw ServerError.error400("cover обязателен");
  }
  if (!partial || "blog" in body) {
    const blogField = body.blog;
    const html =
      blogField &&
      typeof blogField === "object" &&
      typeof (blogField as { __html?: unknown }).__html === "string"
        ? String((blogField as { __html: string }).__html).trim()
        : "";
    if (!html || html === "<p></p>") {
      throw ServerError.error400("Текст поста обязателен");
    }
  }
};

const nextPostId = async (): Promise<number> => {
  const last = await blog.findOne({}).sort({ post_id: -1 }).select("post_id");
  return (last?.post_id ?? 0) + 1;
};

/** Public: active posts sorted by post_id desc */
export const getBlogs = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await blog
      .find({ isActive: { $ne: false } })
      .sort({ post_id: -1 });
    return res.status(200).send({ posts });
  } catch {
    return next(ServerError.error500());
  }
};

/** Admin: all posts */
export const getAdminBlogs = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await blog.find({}).sort({ post_id: -1 });
    return res.status(200).send({ data: posts });
  } catch {
    return next(ServerError.error500());
  }
};

export const getBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await blog.findById(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Пост не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch {
    return next(ServerError.error500());
  }
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body ?? {};
    assertBlogBody(body);

    const html = String((body.blog as { __html: string }).__html);
    const doc = await blog.create({
      post_id: await nextPostId(),
      title: String(body.title).trim(),
      subtitle:
        typeof body.subtitle === "string" ? body.subtitle.trim() : "",
      slug: String(body.slug).trim(),
      createdAt:
        typeof body.createdAt === "string" && body.createdAt.trim()
          ? body.createdAt.trim()
          : formatCreatedAt(),
      cover: String(body.cover).trim(),
      likes: 0,
      hashtags: normalizeHashtags(body.hashtags),
      author: typeof body.author === "string" ? body.author.trim() : "",
      blog: { __html: html },
      isActive: body.isActive !== false && body.isActive !== "false",
    });
    return res.status(201).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isValidationError(err)) {
      return next(ServerError.error400("Некорректные данные поста"));
    }
    return next(ServerError.error500());
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existing = await blog.findById(req.params.id);
    if (!existing) {
      return next(ServerError.error404("Пост не найден"));
    }

    const body = { ...(req.body ?? {}) };
    delete body._id;
    delete body.__v;
    delete body.post_id;
    assertBlogBody(body, true);

    if (typeof body.title === "string") body.title = body.title.trim();
    if (typeof body.subtitle === "string") body.subtitle = body.subtitle.trim();
    if (typeof body.slug === "string") body.slug = body.slug.trim();
    if (typeof body.cover === "string") body.cover = body.cover.trim();
    if (typeof body.author === "string") body.author = body.author.trim();
    if (typeof body.createdAt === "string") {
      body.createdAt = body.createdAt.trim();
    }
    if ("hashtags" in body) {
      body.hashtags = normalizeHashtags(body.hashtags);
    }
    if ("isActive" in body) {
      body.isActive = body.isActive !== false && body.isActive !== "false";
    }
    if (
      body.blog &&
      typeof body.blog === "object" &&
      typeof (body.blog as { __html?: unknown }).__html === "string"
    ) {
      body.blog = {
        __html: String((body.blog as { __html: string }).__html),
      };
    }

    const doc = await blog.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(ServerError.error404("Пост не найден"));
    }

    if (
      typeof body.cover === "string" &&
      body.cover &&
      body.cover !== existing.cover
    ) {
      await safeDeleteStorageUrl(existing.cover);
    }

    return res.status(200).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isValidationError(err)) {
      return next(ServerError.error400("Некорректные данные поста"));
    }
    return next(ServerError.error500());
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await blog.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Пост не найден"));
    }
    await safeDeleteStorageUrl(doc.cover);
    return res.status(200).send({ message: "Пост удалён", data: doc });
  } catch {
    return next(ServerError.error500());
  }
};

export const uploadBlogCover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uploaded = req.files?.files;
    const file = (Array.isArray(uploaded) ? uploaded[0] : uploaded) as
      | UploadedFile
      | undefined;
    if (!file) {
      return next(ServerError.error400("Файл не передан"));
    }

    const ext = ALLOWED_MIME[file.mimetype];
    if (!ext) {
      return next(
        ServerError.error400(
          "Неверный формат файла. Используйте jpg, png или webp"
        )
      );
    }

    const body: Buffer =
      file.data && file.data.length > 0
        ? file.data
        : file.tempFilePath
          ? await readFile(file.tempFilePath)
          : Buffer.alloc(0);

    if (!body.length) {
      return next(ServerError.error400("Файл не передан"));
    }

    const key = `${getBlogCoversPrefix()}/${crypto.randomUUID()}${ext}`;
    const url = await uploadBlogCoverObject(key, body, file.mimetype);
    return res.status(200).send({ data: { url } });
  } catch (err) {
    console.error("Blog cover upload failed:", err);
    if (err instanceof ServerError) {
      return next(err);
    }
    return next(
      ServerError.error500("Не удалось загрузить обложку в хранилище")
    );
  }
};
