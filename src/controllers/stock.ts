import { NextFunction, Request, Response } from "express";
import ServerError from "../utils/server-error-class";
import { STOCK_TOKEN } from "../app";
import product from "models/product";





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

        if (item["НаименованиеНоменклатуры"].includes('BASED')) {
            const updatedItem = await product.findOne({ oneCCode: item["КодНоменклатуры"] });
            if (updatedItem) updatedItem.sizes[0].qty = item["Количество"]
            await updatedItem?.save();
            return
        }

        let updatedItem = await product.findOne({ oneCCode: item["КодНоменклатуры"]});

        if (updatedItem) {

          let sizesArr: Array<{ name: string, qty: number}> = [];
          item["Характеристики"].forEach((size: any) => {
            sizesArr.push({
                name: size["НаименованиеХарактеристики"],
                qty: size["Количество"]
            })
          });
          updatedItem.sizes = sizesArr;
          updatedItem.save();
          return
        }

      })


      return res.status(200).send({ data: body });
    }
    catch(e) {
      next(ServerError.error500());
    }





}