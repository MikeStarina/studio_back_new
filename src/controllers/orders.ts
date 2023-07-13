import { NextFunction, Request, Response } from "express";
import order from "../models/order";
import { sendMail } from "../utils/mailer";
import { paymentRequest } from "../utils/payment";
import ServerError from "../utils/server-error-class";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderData = await req.body;

  const data = {
    owner_name: orderData.owner_name,
    owner_phone: orderData.owner_phone,
    owner_email: orderData.owner_email,
    total_price: orderData.order_total_price,
    discounted_price: orderData.order_discounted_price,
    promocode: orderData.order_promocode,
    order_key: orderData.order_key,
    order_details: orderData.items,
    isShipping: orderData.isShipping,
    shipping_city: orderData.shipping_city,
    packages: orderData.packages,
    shipping_price: orderData.shipping_price,
    shipping_point: orderData.shipping_point,
  };

  try {
    let newOrder;
    newOrder = await new order(data);

    // console.log(newOrder);

    const receiptItems: any[] = [];

    let allPrintPrice = 0;
    orderData.items.forEach((item: any, index: number) => {
      let newReceiptItem = {
        description: item.print ? item.textile + " c печатью" : item.textile,
        quantity: item.qtyAll,
        amount: {
          value: (item.item_price-item.printPrice)/item.qtyAll,
          currency: "RUB",
        },
        vat_code: "2",
        payment_mode: "full_prepayment",
        payment_subject: "commodity",
      };

      allPrintPrice += item.printPrice;
      receiptItems.push(newReceiptItem);
    });

    receiptItems.push({
      description: "Услуги печати",
      quantity: 1,
      amount: {
        value: allPrintPrice,
        currency: "RUB",
      },
      vat_code: "2",
      payment_mode: "full_prepayment",
      payment_subject: "commodity",
    });

    receiptItems.push({
      description: "Доставка СДЕК",
      quantity: 1,
      amount: {
        value: data.shipping_price,
        currency: "RUB",
      },
      vat_code: "2",
      payment_mode: "full_prepayment",
      payment_subject: "commodity",
    });

    const paymentData = {
      amount: {
        value: newOrder.discounted_price,
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: "https://studio.pnhd.ru",
      },
      receipt: {
        customer: {
          full_name: newOrder.owner_name,
          phone: newOrder.owner_phone,
        },
        items: receiptItems,
      },
      description: newOrder._id.toString(),
      capture: true,
      metadata: {
        id: newOrder._id.toString(),
      },
    };

    console.log(receiptItems);
    // const paymentUrl = await paymentRequest(paymentData);
    // let payload = `Ваш заказ на сумму ${newOrder.discounted_price} Р. будет выполнен после оплаты.
    // Дублируем ссылку на оплату на всякий случай: ${paymentUrl}`;

    // sendMail({ to: newOrder.owner_email, subject: `PNHD STUDIO | Заказ создан и ожидает оплаты`, payload});

    // let staffPayload = {
    //   to: 'studio@pnhd.ru',
    //   subject: `Создан заказ ${newOrder._id} [не оплачено]`,
    //   payload: `Заказчик: ${newOrder.owner_name}, телефон: ${newOrder.owner_phone}, сумма заказа: ${newOrder.discounted_price}`
    // }

    // sendMail(staffPayload);

    const orderId = newOrder._id;
    newOrder.save();
    // return await res.send({ paymentUrl, id: newOrder._id });
    // return await res.send({ newOrder });
  } catch {
    next(ServerError.error400());
    //next(e.message);
  }
};

/*
  {
    "order_number": 1000;
    "owner_name": "test";
    "owner_phone": "test";
    "owner_email": "test";
    "total_price": 10000;
  }




*/
