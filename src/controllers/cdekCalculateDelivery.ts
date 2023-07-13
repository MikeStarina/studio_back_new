import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { getCdekToken } from "../utils/cdek-token";
import fetch from "node-fetch";

const ENV = dotenv.config();
const CDEK_CALCULATE_DELIVERY = ENV.parsed!.CDEK_CALCULATE_DELIVERY.toString();

export const cdekCalculateDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getCdekToken();
    const deliveryPoint = await fetch(`${CDEK_CALCULATE_DELIVERY} `, {
      // const deliveryPoint = await fetch(`https://api.cdek.ru/v2/calculator/tariff`, {
      method: "POST",
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${await getCdekToken()} `,
      },
      body: JSON.stringify(req.body),
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
