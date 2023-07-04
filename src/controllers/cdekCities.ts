import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import ServerError from "../utils/server-error-class";
import fetch from "node-fetch";
import { getCdekToken } from "../utils/cdek-token";

const ENV = dotenv.config();
const CDEK_CITIES_URL = ENV.parsed!.CDEK_CITIES_URL.toString();

export const cdekCities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  Берем запрос с фронта, весь после "?" и подставляем в запрос серверу..
  const url = req.originalUrl.split("?").slice(1).join();
  try {
    await getCdekToken();
    const cities = await fetch(`${CDEK_CITIES_URL}?${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getCdekToken()} `,
      },
    });
    const data = await cities.json();
    if (cities.status === 404) {
      return res.status(404).json({ error: "server CDEK cities" });
    }
    return res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
