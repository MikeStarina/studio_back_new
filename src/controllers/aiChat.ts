import {Response, Request, NextFunction, json} from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

const ENV = dotenv.config();
const AI_CHAT = ENV.parsed!.AI_CHAT.toString();
const AI_KEY = ENV.parsed!.AI_KEY.toString();

export const aiChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const body = JSON.stringify({
    "model": "dall-e-3",
    "prompt": "гном",
    "n": 1,
    "size": "1024x1024"
  })

  try {
    const image = await fetch(`${AI_CHAT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_KEY} `,
      },
      body,
    });

    const data = await image.json();

    if (image.status === 404) {
      return res.status(404).json({ error: "AI CHAT ERROR" });
    }
    console.log(data.data)
    return res.json(data.data[0].url);
  } catch (err) {
    res.status(500).json(err);
  }
}
