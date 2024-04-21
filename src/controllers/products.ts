import { Request, Response } from 'express';
import product from '../models/product';





export const getProducts = (req: Request, res: Response) => {

    const params = req.query;
    return product.find({...params})
      .then((products) => { res.status(200).send({ data: products }) })
      .catch(() => { res.status(500).send({ message: "Server Error" })})
}




