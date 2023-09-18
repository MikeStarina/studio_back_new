import { Request, Response, NextFunction } from "express";
import path from "path";
import crypto from "crypto";
import imageSize from "image-size";
import ServerError from "../utils/server-error-class";

export const uploadFunc = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files: any = await req.files;

  try {
    let fileExt = "";
    if (
      files.files.mimetype !== "image/jpeg" ||
      files.files.mimetype !== "image/jpg"
    ) {
      fileExt = ".jpg";
    } else if (files.files.mimetype !== "image/png") {
      fileExt = ".png";
    } else {
      throw ServerError.error400(
        "Неверный формат файла. Используйте png или jpg"
      );
    }
    const date = new Date().getDate() === 31 ? 30 : new Date().getDate();
    const month = new Date().getMonth() + 1;
    const day = `${month}${date}`;

    const newFilename = `${crypto.randomUUID()}-a99a-${day}${fileExt}`;

    const filePath = path.resolve(`src/public/uploads/${newFilename}`);

    const fileUrl = `/uploads/${newFilename}`;
    await files.files.mv(filePath);
    const size = await imageSize(filePath);

    if (!size)
      throw ServerError.error500(
        "произошла неизвестная ошибка при загрузке файла"
      );

    res.send({
      message: "upload succesful",
      url: fileUrl,
      name: newFilename,
      width: size.width,
      height: size.height,
    });
  } catch (e) {
    next(e);
  }
};
