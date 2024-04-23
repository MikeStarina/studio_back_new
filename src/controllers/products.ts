import { Request, Response } from 'express';
import product from '../models/product';





export const getProducts = async (req: Request, res: Response) => {

    const params = req.query;
    const headers = req.headers;
    //console.log(headers);
    const products = await product.find({...params})
    return res.status(200).send({ data: products });
      //.then((products) => { res.status(200).send({ data: products }) })
      //.catch(() => { res.status(500).send({ message: "Server Error" })})
}




