import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import ServerError from "../utils/server-error-class";
import fetch from 'node-fetch';


const ENV = dotenv.config();
const CDEK_AUTH_URL = ENV.parsed!.CDEK_AUTH_URL.toString();
const CDEK_CLIENT_ID = ENV.parsed!.CDEK_CLIENT_ID.toString();
const CDEK_CLIENT_SECRET = ENV.parsed!.CDEK_CLIENT_SECRET.toString();




export const cdekAuth = async (req: Request, res: Response, next: NextFunction) => {



  try {

    const authResponse = await fetch(`${CDEK_AUTH_URL}/token?grant_type=client_credentials&client_id=${CDEK_CLIENT_ID}&client_secret=${CDEK_CLIENT_SECRET}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Length': '0',
        "content-type": "application/json"
      }
    })

    if (!authResponse) throw ServerError.error500('Не удалось выполнить авторизацию СДЕК')


    console.log(authResponse);


    return await res.status(200).send(authResponse);

  }

  catch {
    next(ServerError.error500());
  }




}