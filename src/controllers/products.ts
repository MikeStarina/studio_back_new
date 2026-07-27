import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { readFile } from "fs/promises";
import { UploadedFile } from "express-fileupload";
import product from "../models/product";
import ServerError from "../utils/server-error-class";
import {
  getProductPhotosPrefix,
  uploadProductPhotoObject,
  deleteObjectByKey,
  deleteObjectsByPrefix,
  keyFromCdnUrl,
} from "../utils/yandex-storage";

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const isMongoDuplicateKey = (err: unknown): boolean =>
  Boolean(
    err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: number }).code === 11000
  );

const isValidationError = (err: unknown): boolean =>
  Boolean(
    err &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name: string }).name === "ValidationError"
  );

const normalizeProductBody = (body: Record<string, unknown>) => {
  const next = { ...body };
  if (typeof next.slug === "string") {
    next.slug = next.slug.trim();
  }
  return next;
};

const assertSlugAndSizes = (body: Record<string, unknown>) => {
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    throw ServerError.error400("Slug обязателен");
  }

  const sizes = body.sizes;
  if (!Array.isArray(sizes) || sizes.length < 1) {
    throw ServerError.error400("Добавьте хотя бы один размер");
  }
  const hasNamedSize = sizes.some(
    (s) =>
      s &&
      typeof s === "object" &&
      typeof (s as { name?: unknown }).name === "string" &&
      String((s as { name: string }).name).trim() !== ""
  );
  if (!hasNamedSize) {
    throw ServerError.error400("Добавьте хотя бы один размер");
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const params = req.query;
  console.log("request");
  const products = await product.find({ ...params });
  return res.status(200).send({ data: products });
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await product.findById(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch {
    return next(ServerError.error500());
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = normalizeProductBody(req.body ?? {});
    assertSlugAndSizes(body);
    const doc = await product.create(body);
    return res.status(201).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isMongoDuplicateKey(err)) {
      return next(ServerError.error400("Товар с таким slug уже существует"));
    }
    if (isValidationError(err)) {
      return next(ServerError.error400("Некорректные данные товара"));
    }
    return next(ServerError.error500());
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = normalizeProductBody({ ...(req.body ?? {}) });
    delete body._id;
    delete body.__v;

    if ("slug" in body || "sizes" in body) {
      // For partial PATCH, load current doc to validate combined state
      const current = await product.findById(req.params.id).lean();
      if (!current) {
        return next(ServerError.error404("Товар не найден"));
      }
      assertSlugAndSizes({
        slug: body.slug ?? current.slug,
        sizes: body.sizes ?? current.sizes,
      });
    }

    const doc = await product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isMongoDuplicateKey(err)) {
      return next(ServerError.error400("Товар с таким slug уже существует"));
    }
    if (isValidationError(err)) {
      return next(ServerError.error400("Некорректные данные товара"));
    }
    return next(ServerError.error500());
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await product.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }
    try {
      await deleteObjectsByPrefix(`${getProductPhotosPrefix()}/${doc._id}/`);
    } catch (err) {
      console.error("Failed to clean up product photos in storage:", err);
    }
    return res.status(200).send({ message: "deleted", data: doc });
  } catch {
    return next(ServerError.error500());
  }
};

export const uploadProductPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await product.findById(req.params.id).lean();
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }

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

    const key = `${getProductPhotosPrefix()}/${doc._id}/${crypto.randomUUID()}${ext}`;
    const url = await uploadProductPhotoObject(key, body, file.mimetype);
    return res.status(200).send({ data: { url } });
  } catch (err) {
    console.error("Product photo upload failed:", err);
    if (err instanceof ServerError) {
      return next(err);
    }
    return next(ServerError.error500("Не удалось загрузить фото в хранилище"));
  }
};

export const deleteProductPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = (req.body ?? {}).url;
    if (typeof url !== "string" || !url) {
      return next(ServerError.error400("Не передан адрес фото"));
    }

    const doc = await product.findById(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Товар не найден"));
    }

    doc.photos = (doc.photos ?? []).filter((item) => item !== url);
    await doc.save();

    // Only touch storage for keys owned by this product, so a stray URL
    // can be unlinked from the document without deleting someone else's object.
    const key = keyFromCdnUrl(url);
    if (key?.startsWith(`${getProductPhotosPrefix()}/${doc._id}/`)) {
      try {
        await deleteObjectByKey(key);
      } catch (err) {
        console.error("Failed to delete product photo from storage:", err);
      }
    }

    return res.status(200).send({ data: doc });
  } catch (err) {
    if (err instanceof ServerError) {
      return next(err);
    }
    return next(ServerError.error500());
  }
};
