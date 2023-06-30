import { Request, Response, NextFunction } from "express";
import ServerError from "../utils/server-error-class";
import lead from "../models/lead";
import { sendMail } from "../utils/mailer";
import { getCdekToken } from "../utils/cdek-token";

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone } = await req.body;

  try {
    const newLead = await new lead({ name, phone });

    // До настройки роутов, 18, 19 строка актуальна для теста запроса на наличее токена...
    // const cache = await getCdekToken();
    // console.log(cache, new Date().getMinutes());

    const payload = `Имя: ${name}, Телефон: ${phone}`;

    await sendMail({
      to: "studio@pnhd.ru",
      subject: "Новая заявка на звонок",
      payload,
    });

    return await res.send({ message: "Заявка отправлена" }), newLead.save();
  } catch {
    next(ServerError.error500());
  }
};
