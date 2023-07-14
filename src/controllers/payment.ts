import { NextFunction, Request, Response } from "express"
import order from "../models/order";
import { sendMail } from "../utils/mailer";
import ServerError from "../utils/server-error-class";


export const getPaymentConfirmation = async (req: Request, res: Response, next: NextFunction) => {



  const { object } = req.body;
  const id = object.metadata.id;


  try {
    const currentOrder = await order.findOne({ _id: id });

    //console.log(currentOrder);
    currentOrder!.isPayed = true;
    currentOrder!.order_status = 'pending';

    const userMailData = {
      to: currentOrder!.owner_email,
      subject: 'PNHD STUDIO | Ваш заказ оплачен',
      payload: 'Ваш заказ успешно оплачен! Немного магии и скоро все будет готово!'
    };

    let order_details_string = `Имя: ${currentOrder!.owner_name}, Телефон: ${currentOrder!.owner_phone}, Email: ${currentOrder!.owner_email}, Полная стоимость: ${currentOrder!.total_price}, ${currentOrder!.promocode ? 'Промокод ' + currentOrder!.promocode : ''}, ${currentOrder!.promocode ? 'Стоимость со скидкой ' + currentOrder!.discounted_price : ''} `;
    currentOrder!.order_details.forEach((item, index) => {
      order_details_string = order_details_string + `№${index + 1}: Текстиль: ${item.textile}; Количество: ${item.qty}; Печать: Грудь: ${item.front_print ? item.front_print : ''}; Спина: ${item.back_print ? item.back_print : ''}; Л.Рукав: ${item.lsleeve_print ? item.lsleeve_print : ''}; П.Рукав: ${item.rsleeve_print ? item.rsleeve_print : ''} //`;
    })

    const staffMailData = {
      to: 'studio@pnhd.ru',
      subject: `Новый заказ ${currentOrder!._id}` ,
      payload: order_details_string
    };

    //await sendMail(userMailData) //письмо клиенту
    //await sendMail(staffMailData) //письмо наше

    await currentOrder!.save();
  }
  catch {
    next(ServerError.error500())

  }


  res.status(200).send({ message: 'ok' });
}