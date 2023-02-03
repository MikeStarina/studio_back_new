import { Request, Response, NextFunction } from "express";
import path from "path";
import imageSize from "image-size";








export const uploadFunc = async (req: Request, res: Response, next: NextFunction) => {
  const files: any = await req.files;




  const filePath = path.resolve(`src/public/uploads/${files.files.name}`);

  const fileUrl = `/uploads/${files.files.name}`;
  await files.files.mv(filePath);

  const size = await imageSize(filePath)




  res.send({ message: 'upload succesful', url: fileUrl, name: files.files.name, width: size.width, height: size.height });
}