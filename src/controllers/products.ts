import { Request, Response } from 'express';
import product from '../models/product';





export const getProducts = (req: Request, res: Response) => {


    return product.find({})
      .then((products) => { res.status(200).send({ data: products }) })
      .catch(() => { res.status(500).send({ message: "Server Error" })})
}




export const getProduct = (req: Request, res: Response) => {

  const { id } = req.params;

  return product.findOne({ id })
    .then((product) => { res.status(200).send({ data: product }) })
    .catch(() => { res.status(500).send({ message: "Server Error" })})

}