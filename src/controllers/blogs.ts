import { Response, Request } from "express";
import blog from "../models/blog";

export const getBlogs = async (req: Request, res: Response) => {

  const posts = await blog.find({});
  return res.status(200).send({ posts: posts });
}
