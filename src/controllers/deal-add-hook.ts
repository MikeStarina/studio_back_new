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



/* {
  event: 'ONCRMDEALADD',
  data: { FIELDS: { ID: '9678' } },
  ts: '1715086657',
  auth: {
    domain: 'studio.bitrix24.ru',
    client_endpoint: 'https://studio.bitrix24.ru/rest/',
    server_endpoint: 'https://oauth.bitrix.info/rest/',
    member_id: '5b7d6464a7bfa19dbe6c3cdd5e5c1298',
    application_token: 't5ukj5gdwwpu8ae59u9iac0ckgpqne0j'
  }
} */