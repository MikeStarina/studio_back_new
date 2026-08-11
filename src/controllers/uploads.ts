import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { readFile } from "fs/promises";
import imageSize from "image-size";
import { UploadedFile } from "express-fileupload";
import ServerError from "../utils/server-error-class";
import {
  getPrintsPrefix,
  uploadPrintObject,
} from "../utils/yandex-storage";

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

export const uploadFunc = async (
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
          "Неверный формат файла. Используйте jpg, png, gif или webp"
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

    const size = imageSize(body);
    if (!size?.width || !size?.height) {
      return next(
        ServerError.error500(
          "произошла неизвестная ошибка при загрузке файла"
        )
      );
    }

    const newFilename = `${crypto.randomUUID()}${ext}`;
    const key = `${getPrintsPrefix()}/${newFilename}`;
    const url = await uploadPrintObject(key, body, file.mimetype);

    return res.send({
      message: "upload succesful",
      url,
      name: newFilename,
      width: size.width,
      height: size.height,
    });
  } catch (e) {
    console.error("Print upload failed:", e);
    if (e instanceof ServerError) {
      return next(e);
    }
    return next(
      ServerError.error500("Не удалось загрузить файл в хранилище")
    );
  }
};
