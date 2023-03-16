import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import ServerError from "../utils/server-error-class";
import fetch from 'node-fetch';


const ENV = dotenv.config();
const CDEK_CITIES_URL = ENV.parsed!.CDEK_CITIES_URL.toString();


export const cdekCities = async (req: Request, res: Response, next: NextFunction) => {


  const cdekToken = req.body.token;


  try {

    const cities = fetch(`${CDEK_CITIES_URL}`, {
      method: 'GET',
      headers: {
        'Accept': '*',
        'Content-Length': '',
        "Сontent-type": "application/json",
        'Authorization': cdekToken,
      }
    })


    if (!cities) throw ServerError.error500('Не удалось получить список городов СДЕК')


    return await res.status(200).send(cities);

  }
  catch {
    ServerError.error500();
  }
}