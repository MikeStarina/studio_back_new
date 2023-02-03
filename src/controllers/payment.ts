import { NextFunction, Request, Response } from "express"
import order from "../models/order";
import { sendMail } from "../utils/mailer";
import ServerError from "../utils/server-error-class";


export const getPaymentConfirmation = async (req: Request, res: Response, next: NextFunction) => {


  console.log(req.body);

  /*

  try {
    const currentOrder = await order.findOne({ description });
    currentOrder!.isPayed = true;

    const userMailData = {
      to: currentOrder!.owner_email,
      subject: '',
    };

    const staffMailData = {
      to: currentOrder!.owner_email,
      subject: '',
    };

    await sendMail(userMailData) //письмо клиенту
    await sendMail(staffMailData) //письмо наше

    await currentOrder!.save();
  }
  catch {
    next(ServerError.error500())

  }
  */
}