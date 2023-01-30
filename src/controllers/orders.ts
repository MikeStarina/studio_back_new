import { NextFunction, Request, Response } from 'express';
import order from '../models/order';
import { sendMail } from '../utils/mailer';
import { paymentRequest } from '../utils/payment';
import ServerError from '../utils/server-error-class';







export const createOrder = async (req: Request, res: Response, next: NextFunction) => {

  const orderData = req.body;


  let newOrder;

  try {
    newOrder = await new order(orderData);




    const receiptItems: any[] = [];

    /*
    orderData.items.forEach((item: any, index: number) => {
      let newReceiptItem = {
        "description": item.print ? item.textile + 'c печатью' : item.textile,
              "quantity": item.qty,
              "amount": {
                "value": item.item_price,
                "currency": "RUB"
              },
              "vat_code": "2",
              "payment_mode": "full_prepayment",
              "payment_subject": "commodity"
      }

      receiptItems.push(newReceiptItem);
    }) */

    const paymentData = {
      "amount": {
        "value": newOrder!.discounted_price ? newOrder.discounted_price : newOrder.total_price,
        "currency": "RUB"
      },
      "confirmation": {
        "type": "redirect",
        "return_url": "https://studio.pnhd.ru"
      },
      "receipt": {
        "customer": {
          "full_name": newOrder.owner_name,
          "phone": newOrder.owner_phone,
        },
        "items": receiptItems,
      },
      "description": newOrder._id,
      "capture": true,
    }

    const paymentUrl = await paymentRequest(paymentData);
    await sendMail({ to: newOrder.owner_email, subject: `New order №${newOrder.order_number}`});






    await newOrder.save();
    return res.send({ data: paymentUrl });
  }
  catch {
    next(ServerError.error400());
  }

}



/*
  {
    "order_number": 1000;
    "owner_name": "test";
    "owner_phone": "test";
    "owner_email": "test";
    "total_price": 10000;
  }




*/