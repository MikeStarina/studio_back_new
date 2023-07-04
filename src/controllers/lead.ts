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

    const payload = `Имя: ${name}, Телефон: ${phone}`;

    // Код тут актуален до настройки роутов на сдек
    // const cache = await getCdekToken();
    // console.log(
    //   cache,
    //   "<< token from memory",
    //   new Date().getHours(),
    //   new Date().getMinutes()
    // );

    sendMail({
      to: "studio@pnhd.ru",
      subject: "Новая заявка на звонок",
      payload,
    });

    return await res.send({ message: "Заявка отправлена" }), newLead.save();
  } catch {
    next(ServerError.error500());
  }
};
