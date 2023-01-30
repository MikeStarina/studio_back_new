import { Request, Response, NextFunction, Errback } from "express";
import ServerError from "../utils/server-error-class";



export const errorHandler = (err: Errback, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof ServerError) {
    return res.status(err.status).send({ message: err.message });
  }


  return res.status(500).send({ message: 'На сервере произошла ошибка' });
}