import { NextFunction, Request, Response } from "express"
import order from "../models/order";
import { sendMail } from "../utils/mailer";
import ServerError from "../utils/server-error-class";


export const getPaymentConfirmation = async (req: Request, res: Response, next: NextFunction) => {



  const { object } = req.body;
  console.log(object);
  const id = object.metadata.id;
  console.log(id);


  try {
    const currentOrder = await order.findOne({ id });
    currentOrder!.isPayed = true;
    currentOrder!.order_status = 'pending';

    const userMailData = {
      to: currentOrder!.owner_email,
      subject: 'Ваш заказ оплачен',
      payload: 'Ваш заказ успешно оплачен! Немного магии и скоро все будет готово!'
    };

    let order_details_string = '';
    currentOrder!.order_details.forEach((item, index) => {
      order_details_string = order_details_string + `№${index + 1}: Текстиль: ${item.textile}; Количество: ${item.qty}; Печать: Грудь: ${item.print?.front_print ? item.print.front_print : ''}; Спина: ${item.print?.back_print ? item.print.back_print : ''}; Л.Рукав: ${item.print?.lsleeve_print ? item.print.lsleeve_print : ''}; П.Рукав: ${item.print?.rsleeve_print ? item.print.rsleeve_print : ''} //`;
    })

    const staffMailData = {
      to: currentOrder!.owner_email,
      subject: 'Новый заказ',
      payload: order_details_string
    };

    await sendMail(userMailData) //письмо клиенту
    await sendMail(staffMailData) //письмо наше

    await currentOrder!.save();
  }
  catch {
    next(ServerError.error500())

  }


  res.status(200).send({ message: 'ok' });
}