import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { getCdekToken } from "../utils/cdek-token";

const ENV = dotenv.config();
const CDEK_CREATE_ORDER = ENV.parsed!.CDEK_CREATE_ORDER.toString();

export const cdekCreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getCdekToken();
    const createOrder = await fetch(`${CDEK_CREATE_ORDER}`, {
      method: "POST",
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${await getCdekToken()} `,
      },
      body: JSON.stringify({
        type: 1,
        tariff_code: 138,
        comment: "Новый заказ",
        shipment_point: "MSK67",
        sender: {
          company: "Компания",
          name: "Петров Петр",
          email: "msk@cdek.ru",
          phones: [
            {
              number: "+79134000101",
            },
          ],
        },
        recipient: {
          company: "Иванов Иван",
          name: "Иванов Иван",
          passport_series: "5008",
          passport_number: "345123",
          passport_date_of_issue: "2019-03-12",
          passport_organization: "ОВД Москвы",
          tin: "123546789",
          email: "email@gmail.com",
          phones: [
            {
              number: "+79134000404",
            },
          ],
        },
        to_location: {
          code: "44",
          fias_guid: "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
          postal_code: "109004",
          longitude: 37.6204,
          latitude: 55.754,
          country_code: "RU",
          region: "Москва",
          sub_region: "Москва",
          city: "Москва",
          kladr_code: "7700000000000",
          address: "ул. Блюхера, 32",
        },
        services: [
          {
            code: "INSURANCE",
            parameter: "3000",
          },
        ],
        packages: [
          {
            items: [
              {
                ware_key: "00055",
                payment: {
                  value: 3000,
                },
                name: "Товар",
                cost: 300,
                amount: 2,
                weight: 700,
                url: "www.item.ru",
              },
            ],
            number: "bar-001",
            weight: "1000",
            length: 10,
            width: 140,
            height: 140,
            comment: "Комментарий к упаковке",
          },
        ],
      }),
    });
    const order = await createOrder.json();
    return res.json(order);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
