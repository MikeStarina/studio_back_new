import { Request, Response, NextFunction } from "express";
import ServerError from "../utils/server-error-class";
import fetch from "node-fetch";


export const dealAddHook = async (req: Request, res: Response, next: NextFunction) => {

  const dealId = await req.body.data.FIELDS.ID;
  try {
    if (!dealId) {res.status(500).send({ message: 'wrong data' });};

    const chatIdres = await fetch(`https://studio.bitrix24.ru/rest/1/s3r64dqub19xled8/imopenlines.crm.chat.get.json?CRM_ENTITY_TYPE=deal&CRM_ENTITY=${dealId}`).then(res => res.json());
    const chatId = chatIdres.result[0].CHAT_ID;
  }
  catch(e) {
    next(e);
  }


  res.status(200).send({ message: 'ok' });


}



