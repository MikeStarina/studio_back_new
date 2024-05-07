import { Request, Response, NextFunction } from "express";
import ServerError from "../utils/server-error-class";



export const dealAddHook = async (req: Request, res: Response, next: NextFunction) => {

  const data = req.body;
  console.log(data)


  res.status(200).send({ message: 'ok' });


}