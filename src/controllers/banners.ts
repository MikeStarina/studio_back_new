import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { readFile } from "fs/promises";
import { UploadedFile } from "express-fileupload";
import banner from "../models/banner";
import ServerError from "../utils/server-error-class";
import {
  getBannersPrefix,
  deleteObjectByKey,
  keyFromCdnUrl,
  uploadBannerObject,
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

const assertBannerBody = (body: Record<string, unknown>, partial = false) => {
  if (!partial || "imageUrl" in body) {
    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    if (!imageUrl) {
      throw ServerError.error400("imageUrl обязателен");
    }
  }
  if (!partial || "link" in body) {
    const link = typeof body.link === "string" ? body.link.trim() : "";
    if (!link) {
      throw ServerError.error400("link обязателен");
    }
  }
  if (!partial || "order" in body) {
    const order = Number(body.order);
    if (!Number.isFinite(order)) {
      throw ServerError.error400("order должен быть числом");
    }
  }
};

/** Public: active banners sorted by order */
export const getBanners = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await banner.find({ isActive: true }).sort({ order: 1 });
    return res.status(200).send({ data: docs });
  } catch {
    return next(ServerError.error500());
  }
};

/** Admin: all banners */
export const getAdminBanners = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = await banner.find({}).sort({ order: 1 });
    return res.status(200).send({ data: docs });
  } catch {
    return next(ServerError.error500());
  }
};

export const getBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await banner.findById(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Баннер не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch {
    return next(ServerError.error500());
  }
};

export const createBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body ?? {};
    assertBannerBody(body);
    const doc = await banner.create({
      imageUrl: String(body.imageUrl).trim(),
      link: String(body.link).trim(),
      order: Number(body.order),
      isActive: body.isActive !== false && body.isActive !== "false",
    });
    return res.status(201).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isValidationError(err)) {
      return next(ServerError.error400("Некорректные данные баннера"));
    }
    return next(ServerError.error500());
  }
};

export const updateBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = { ...(req.body ?? {}) };
    delete body._id;
    delete body.__v;
    assertBannerBody(body, true);

    if (typeof body.imageUrl === "string") {
      body.imageUrl = body.imageUrl.trim();
    }
    if (typeof body.link === "string") {
      body.link = body.link.trim();
    }
    if ("order" in body) {
      body.order = Number(body.order);
    }
    if ("isActive" in body) {
      body.isActive = body.isActive !== false && body.isActive !== "false";
    }

    const doc = await banner.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(ServerError.error404("Баннер не найден"));
    }
    return res.status(200).send({ data: doc });
  } catch (err: unknown) {
    if (err instanceof ServerError) {
      return next(err);
    }
    if (isValidationError(err)) {
      return next(ServerError.error400("Некорректные данные баннера"));
    }
    return next(ServerError.error500());
  }
};

export const deleteBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc = await banner.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(ServerError.error404("Баннер не найден"));
    }

    const key = keyFromCdnUrl(doc.imageUrl);
    if (key) {
      try {
        await deleteObjectByKey(key);
      } catch (err) {
        console.error("Failed to delete banner object from storage:", err);
      }
    }

    return res.status(200).send({ message: "Баннер удалён", data: doc });
  } catch {
    return next(ServerError.error500());
  }
};

export const uploadBannerImage = async (
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

    const key = `${getBannersPrefix()}/${crypto.randomUUID()}${ext}`;
    const url = await uploadBannerObject(key, body, file.mimetype);
    return res.status(200).send({ data: { url } });
  } catch (err) {
    console.error("Banner upload failed:", err);
    if (err instanceof ServerError) {
      return next(err);
    }
    return next(
      ServerError.error500("Не удалось загрузить изображение в хранилище")
    );
  }
};
