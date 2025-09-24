import { NextFunction, Request, Response } from "express";
import ServerError from "../utils/server-error-class";
import { STOCK_TOKEN } from "../app";
import product from "../models/product";





export const stockController = async (req: Request, res: Response, next: NextFunction) => {

    const headers = req.headers;
    const body = await req.body;
    //console.log(req.headers);


    try {
     

     


      return res.status(200).send({ message: "ok" });
    }
    catch(e) {
      next(ServerError.error500());
    }





}