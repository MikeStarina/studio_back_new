import { NextFunction, Request, Response } from "express";
import ServerError from "../utils/server-error-class";
import { STOCK_TOKEN } from "../app";





export const stockController = async (req: Request, res: Response, next: NextFunction) => {

    const headers = req.headers;
    const body = await req.body;
    console.log(headers);
    //console.log(body);

    try {
      // if (headers.authorization !== `Bearer ${STOCK_TOKEN}`) {
      //     return res.status(401).send({ message: 'unauthorized' })
      // }
      return res.status(200).send({ data: body });
    }
    catch(e) {
      next(ServerError.error500());
    }





}