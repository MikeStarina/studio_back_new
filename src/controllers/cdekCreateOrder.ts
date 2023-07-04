import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { getCdekToken } from "../utils/cdek-token";

const ENV = dotenv.config();
const CDEK_CREATE_ORDER = ENV.parsed!.CDEK_CREATE_ORDER.toString();

export const cdekCreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getCdekToken();
    const createOrder = await fetch(`${CDEK_CREATE_ORDER}`, {
      method: "POST",
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${await getCdekToken()} `,
      },
      body: JSON.stringify(req.body),
    });
    const order = await createOrder.json();
    return res.json(order);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
