import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { getCdekToken } from "../utils/cdek-token";
import fetch from "node-fetch";
import ServerError from "../utils/server-error-class";

const ENV = dotenv.config();
const CDEK_DELIVERY_POINTS_URL =
  ENV.parsed!.CDEK_DELIVERY_POINTS_URL.toString();

export const cdekDeliveryPoints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  Берем запрос с фронта, весь после "?" и подставляем в запрос сервера..
  const url = req.originalUrl.split("?").slice(1).join();

  try {
    await getCdekToken();
    const deliveryPoint = await fetch(`${CDEK_DELIVERY_POINTS_URL}?${url} `, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getCdekToken()} `,
      },
    });
    const data = await deliveryPoint.json();

    if (data.status === 404) {
      return res.status(404).json({ error: "server CDEK delivery points" });
    }

    return res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
