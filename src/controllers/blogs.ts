import { Response, Request } from "express";
import blog from "../models/blog";

export const getBlogs = (req: Request, res: Response) => {


  return blog.find({})
    .then((blogs) => { res.status(200).send({ data: blogs }) })
    .catch(() => { res.status(500).send({ message: "Server Error" })})
}
