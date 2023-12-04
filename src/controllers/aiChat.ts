import {Response, Request, NextFunction, json} from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

const ENV = dotenv.config();
const AI_CHAT = ENV.parsed!.AI_CHAT.toString();
const AI_KEY = ENV.parsed!.AI_KEY.toString();

const uploadImage = (data: any) => {
  // console.log('>>>', data, '<<<')
  fetch(data, {
    method: 'GET',
    headers: {
      'Accept': 'image/png',
      'Content-type': 'image/png',
    },
  })
    // .then((res) => res.headers.)
    .then((res) => {
      // console.log('working&&&&&&')
      const tt = res;
      console.log(tt);
      return tt;
    })
    .catch((res) => console.log(res, 'ERORRRRRRRRRR'))
};

export const aiChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { words }: any = await req.body;

  const body = JSON.stringify({
    "model": "dall-e-3",
    "prompt": words,
    "n": 1,
    "size": "1024x1024",
    "response_format": "b64_json"
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

    const bJson = data.data[0].b64_json;

    console.log('data>>>>>>', bJson, '<<<<<data')
    const url = data.data[0].url
    const dat: any = res.json(url);
    // uploadImage(url);

    // return uploadImage(dat);
  } catch (err) {
    res.status(500).json(err);
  }
}
