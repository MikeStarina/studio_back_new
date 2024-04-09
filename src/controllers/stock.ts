import { NextFunction, Request, Response } from "express";
import ServerError from "../utils/server-error-class";



const token = '42c984ed-31fe-4687-9cd7-0fe305d14e0d'

export const stockController = async (req: Request, res: Response, next: NextFunction) => {

    const headers = req.headers;
    const body = await req.body;


    try {

      if (headers.authorization !== 'Bearer 42c984ed-31fe-4687-9cd7-0fe305d14e0d') {
          return res.status(401).send({ message: 'unauthorized' })
      }
      return res.status(200).send({ data: body });
    }
    catch(e) {
      next(ServerError.error500());
    }





}