import { Request, Response, NextFunction } from "express";
import ServerError from "../utils/server-error-class";
import lead from "../models/lead";
import { sendMail } from "../utils/mailer";
import { getCdekToken } from "../utils/cdek-token";
import fetch from "node-fetch";

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, roistat } = await req.body;
  try {
    const newLead = new lead({ name, phone, roistat });

    //const payload = `Имя: ${name}, Телефон: ${phone}`;
    const addContactResponse = await fetch(`https://studio.bitrix24.ru/rest/1/3thx92texmk29ori/crm.contact.add.json?FIELDS[NAME]=${name}&FIELDS[PHONE][0][VALUE]=${phone}`);
    const addContactsResponseJson = await addContactResponse.json();




    const bitrixCreateLeadQuery = `/crm.deal.add.json?FIELDS[TITLE]=Заявка на звонок(тест)&FIELDS[NAME]=${name}&FIELDS[CONTACT_ID]=${addContactsResponseJson.result}&FIELDS[COMMENTS]=${phone}&FIELDS[UF_CRM_1712667811]=${roistat}`;
    const b24res = await fetch(`https://studio.bitrix24.ru/rest/1/xc30vf9u8mxcynr9${bitrixCreateLeadQuery}`)
    const response = await b24res.json()
    //console.log(response);

    // Код тут актуален до настройки роутов на сдек
    // const cache = await getCdekToken();
    // console.log(
    //   cache,
    //   "<< token from memory",
    //   new Date().getHours(),
    //   new Date().getMinutes()
    // );

    // sendMail({
    //   to: "studio@pnhd.ru",
    //   subject: "Новая заявка на звонок",
    //   payload,
    //   html:'',
    // });
    newLead.save();
    return res.send({ message: "Заявка отправлена" });
  } catch {
    next(ServerError.error500());
  }
};


/**
 * [UF_DEPARTMENT] => Array
                        (
                            [0] => 3
                        )

                         [IS_ONLINE] => Y
 */