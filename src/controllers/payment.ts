import { NextFunction, Request, Response } from "express"
import { orderClientTemplate } from "../template/orderClientTemplate";
import order from "../models/order";
import product from "../models/product";
import { sendMail } from "../utils/mailer";
import ServerError from "../utils/server-error-class";
import { editResiduals } from "../utils/edit-resuduals";

export const getPaymentConfirmation = async (req: Request, res: Response, next: NextFunction) => {



  const { object } = req.body;
  const id = object.metadata.id;


  try {
    const currentOrder = await order.findOne({ _id: id });

    currentOrder!.isPayed = true;
    currentOrder!.order_status = 'pending';

    let mailData = {
      owner_name: currentOrder!.owner_name,
      owner_phone: currentOrder!.owner_phone,
      owner_email: currentOrder!.owner_email,
      isShipping: currentOrder!.isShipping,
      shipping_city: currentOrder!.shipping_city,
      shipping_point: currentOrder!.shipping_point,
      total_price: currentOrder!.total_price,
      promocode: currentOrder!.promocode,
      discounted_price: currentOrder!.discounted_price,
      shipping_price: currentOrder!.shipping_price,
      order_details: currentOrder!.order_details,
    }

    const userMailData = {
      to: currentOrder!.owner_email,
      subject: 'PNHD STUDIO | Ваш заказ оплачен',
      payload: 'Ваш заказ успешно оплачен! Немного магии и скоро все будет готово!',
      html: await orderClientTemplate(mailData),
    };

    let order_details_string = `Имя: ${currentOrder!.owner_name}, Телефон: ${currentOrder!.owner_phone}, Email: ${currentOrder!.owner_email}, Полная стоимость: ${currentOrder!.total_price}, ${currentOrder!.promocode ? 'Промокод ' + currentOrder!.promocode : ''}, ${currentOrder!.promocode ? 'Стоимость со скидкой ' + currentOrder!.discounted_price : ''} `;
    currentOrder!.order_details.forEach((item, index) => {
      order_details_string = order_details_string + `№${index + 1}: Текстиль: ${item.textile}; Количество: ${item.qtyAll}; Печать: Грудь: ${item.front_print}; Спина: ${item.back_print}; Л.Рукав: ${item.lsleeve_print}; П.Рукав: ${item.rsleeve_print} //`;
    })

    const staffMailData = {
      to: 'studio@pnhd.ru',
      subject: `Новый заказ ${currentOrder!._id}` ,
      payload: order_details_string,
      html: await orderClientTemplate(mailData)
    };







    const addContactResponse = await fetch(`https://studio.bitrix24.ru/rest/1/3thx92texmk29ori/crm.contact.add.json?FIELDS[NAME]=${currentOrder!.owner_name}&FIELDS[PHONE][0][VALUE]=${currentOrder!.owner_phone}`);
    const addContactsResponseJson = await addContactResponse.json();

    const bitrixCreateLeadQuery = `/crm.deal.add.json?FIELDS[TITLE]=Новый заказ&FIELDS[CONTACT_ID]=${addContactsResponseJson.result}&FIELDS[COMMENTS]=${currentOrder!._id}&FIELDS[OPPORTUNITY]=${currentOrder!.isShipping ? currentOrder!.discounted_price + currentOrder!.shipping_price : currentOrder!.discounted_price}&FIELDS[UF_CRM_1712667811]=${currentOrder!.roistat}`;
    const b24res = await fetch(`https://studio.bitrix24.ru/rest/1/xc30vf9u8mxcynr9${bitrixCreateLeadQuery}`)
    const response = await b24res.json()








    await sendMail(userMailData) //письмо клиенту
    await sendMail(staffMailData) //письмо наше
    const orderDetails = currentOrder?.order_details
    await currentOrder!.save();
    //await editResiduals(orderDetails);
  }
  catch {
    next(ServerError.error500())

  }


  res.status(200).send({ message: 'ok' });
}