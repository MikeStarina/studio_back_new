import { NextFunction, Request, Response } from "express";
import { orderClientTemplate } from "../template/orderClientTemplate";
import Order from "../models/order";
import { sendMail } from "../utils/mailer";
import { paymentRequest } from "../utils/payment";
import ServerError from "../utils/server-error-class";
import { IReceiptItems, IOrderItem } from "types/orders";
import { getPaymentConfirmation } from "./payment";
import order from "../models/order";

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
    shipping: orderData.isShipping ? 'Доставка по РФ' : 'Самовывоз из студии',
    roistat: orderData.roistat
  };

  let printingService = false;
  const freeShipping =
    data.promocode.mechanic === "freeShipping" ? true : false;

  try {
    let newOrder;
    newOrder = await new Order(data);

    const receiptItems: IReceiptItems[] = [];

    let allPrintPrice = 0;
    orderData.items.forEach((item: IOrderItem) => {
      if (item.printPrice > 0) {
        printingService = true;
      }
      let newReceiptItem = {
        description: printingService ? item.name + " c печатью" : item.name,
        quantity: item.qtyAll,
        amount: {
          value: (item.item_price - item.printPrice) / item.qtyAll,
          currency: "RUB",
        },
        vat_code: "2",
        payment_mode: "full_prepayment",
        payment_subject: "commodity",
      };

      allPrintPrice += item.printPrice;
      receiptItems.push(newReceiptItem);
    });

    if (printingService) {
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
    }

    if (data.isShipping) {
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

    }
    /*
    const paymentData = {
      amount: {
        value:  newOrder.isShipping ? newOrder.discounted_price + newOrder.shipping_price : newOrder.discounted_price,
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
          email: newOrder.owner_email,
        },
        items: receiptItems,
      },
      description: newOrder._id.toString(),
      capture: true,
      metadata: {
        id: newOrder._id.toString(),
      },
    };
    */

    newOrder.save(async function (err, newOrderSave) {
      if (err) {
        return err;
      } else {
        //const paymentUrl = await paymentRequest(paymentData);
        const paymentUrl ='';

        let mailData = {
          owner_name: newOrderSave!.owner_name,
          owner_phone: newOrderSave!.owner_phone,
          owner_email: newOrderSave!.owner_email,
          isShipping: newOrderSave!.isShipping,
          shipping_city: newOrderSave!.shipping_city,
          shipping_point: newOrderSave!.shipping_point,
          total_price: newOrderSave!.total_price,
          promocode: newOrderSave!.promocode,
          discounted_price: newOrderSave!.discounted_price,
          shipping_price: newOrderSave!.shipping_price,
          order_details: newOrderSave!.order_details,
        }
    //     let payload = `Ваш заказ на сумму ${newOrderSave.discounted_price} Р. будет выполнен после оплаты.
    // Дублируем ссылку на оплату на всякий случай: ${paymentUrl}`;

        // await sendMail({
        //   to: newOrderSave.owner_email,
        //   subject: `PNHD STUDIO | Заказ создан и ожидает оплаты`,
        //   payload,
        // });
        const userMailData = {
          to: newOrderSave!.owner_email,
          subject: 'PNHD STUDIO | Заказ создан',
          payload: 'Скоро пришлем ссылку для оплаты',
          html: await orderClientTemplate(mailData),
        };
        const staffMailData = {
          to: 'studio@pnhd.ru',
          subject: `Заказ №${newOrderSave!._id} ожидает оплаты` ,
          payload: '',
          html: await orderClientTemplate(mailData)
        };

        await sendMail(userMailData) //письмо клиенту
        await sendMail(staffMailData) //письмо наше

        const addContactResponse = await fetch(`https://studio.bitrix24.ru/rest/1/3thx92texmk29ori/crm.contact.add.json?FIELDS[NAME]=${newOrderSave!.owner_name}&FIELDS[PHONE][0][VALUE]=${newOrderSave!.owner_phone}`);
        const addContactsResponseJson = await addContactResponse.json();

        const bitrixCreateLeadQuery = `/crm.deal.add.json?FIELDS[TITLE]=Новый заказ с сайта&FIELDS[CONTACT_ID]=${addContactsResponseJson.result}&FIELDS[COMMENTS]=${newOrderSave!._id}&FIELDS[OPPORTUNITY]=${newOrderSave!.isShipping ? newOrderSave!.discounted_price + newOrderSave!.shipping_price : newOrderSave!.discounted_price}&FIELDS[UF_CRM_1712667811]=${newOrderSave!.roistat}`;
        await fetch(`https://studio.bitrix24.ru/rest/1/xc30vf9u8mxcynr9${bitrixCreateLeadQuery}`)

        return res.send({ paymentUrl, id: newOrderSave._id });
      }
    });
  } catch {
    next(ServerError.error400());
    // next(e.message);
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
