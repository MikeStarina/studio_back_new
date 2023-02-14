import { Request, Response, NextFunction } from "express";
import promocode from '../models/promocodes';
import ServerError from "../utils/server-error-class";





export const promocodesController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_promocode } = req.body;


  try {
    const userPromocode = await promocode.find({ name: user_promocode });


    if (!userPromocode) throw ServerError.error400('Промокод не найден')

    res.status(200).send({ promocode: userPromocode });
  }
  catch (e) {
    next(e)
  }
}