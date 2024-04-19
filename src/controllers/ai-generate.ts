import { NextFunction, Request, Response } from "express";
import { YANDEX_CATALOG_ID } from "../app";
import { getYandexArtToken } from "../utils/yandex-art-token";
import fetch from "node-fetch";
import ServerError from "../utils/server-error-class";




export const generateImage = async (req: Request, res: Response, next: NextFunction) => {

  //const reqBody = await req.body;
  const generateRequestBody = {
    modelUri: `art://${YANDEX_CATALOG_ID}/yandex-art/latest`,
    generationOptions: {
      seed: 17
    },
    messages: [
      {
        weight: 1,
        //text: reqBody.text,
        text: 'узор из цветных пастельных суккулентов разных сортов, hd full wallpaper, четкий фокус, множество сложных деталей, глубина кадра, вид сверху'
      }
    ]
  }
  try {


    const token = await getYandexArtToken()
    const generateRequest = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(generateRequestBody)
    })
    const parsedRequest = await generateRequest.json();

    if (parsedRequest.id) {
      let i = 1;
      const interval = setInterval(async () => {
        if (i > 1) {
          const resultRequest = await fetch(`https://llm.api.cloud.yandex.net:443/operations/${parsedRequest.id}`);
          const result = await resultRequest.json();
          console.log(result);
          if (result) {
            return res.status(200).send({ data: result})
          }
        }
        i++;
      }, 11000)
    }
    //console.log(parsedRequest);
    //return res.status(200).send({ data: parsedRequest})
  }
  catch(e) {
    next(e);
  }

}