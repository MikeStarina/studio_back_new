import { NextFunction, Request, Response } from "express";
import ServerError from "../utils/server-error-class";
import { STOCK_TOKEN } from "../app";
import product from "../models/product";





export const stockController = async (req: Request, res: Response, next: NextFunction) => {

    const headers = req.headers;
    const body = await req.body;
    console.log(req.headers);
    //console.log(body);

    try {
      if (headers.authorization !== `Bearer ${STOCK_TOKEN}`) {
        return res.status(401).send({ message: 'unauthorized' })
      }

      const data = body["Данные"];
      data.forEach(async (item: any) => {
        if (item["НаименованиеНоменклатуры"].includes('BASED') || item["НаименованиеНоменклатуры"].includes('Кепка') || item["НаименованиеНоменклатуры"].includes('Шоппер')) {
            const sizesArr = [{
              name: "ONE SIZE",
              qty: item["Количество"]
            }]
            await product.updateMany({ oneCCode: item["КодНоменклатуры"] }, { sizes: sizesArr});
            return
        }

        //let updatedItem = await product.find({ oneCCode: item["КодНоменклатуры"] });

        if (true) {
          let sizesArr: Array<{ name: string, qty: number}> = [];

          item["Характеристики"].forEach((size: any) => {
            sizesArr.push({
                name: size["НаименованиеХарактеристики"],
                qty: size["Количество"]
            })
          });
          await product.updateMany({ oneCCode: item["КодНоменклатуры"] }, { sizes: sizesArr });
          return
        }

      })


      return res.status(200).send({ message: "ok" });
    }
    catch(e) {
      next(ServerError.error500());
    }





}