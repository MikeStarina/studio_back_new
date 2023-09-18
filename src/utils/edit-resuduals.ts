import product from "../models/product";
import friends from '../models/friends';
import ServerError from "./server-error-class";
import { TOrderDetailsData, TOrdersDetailsFriend } from "../types/resudals";


export const editResiduals = <TOrderDetailsData, TOrdersDetailsFriend extends keyof TOrderDetailsData>(arr: TOrderDetailsData | undefined)=>{
  try{
    //@ts-ignore
    arr?.forEach(async (item)=>{
      const currentProduct = item.textile.includes('#Безызбежно') ? await friends.findById(item._id) : await product.findById(item._id);
      if(!currentProduct){
        throw ServerError.error400(
          "Неверный id товара."
        );
      }
      //@ts-ignore
      let updateSizes = item.textile.includes('#Безызбежно') ? currentProduct?.products.sizes : currentProduct?.sizes;
      for(let i = 0; i<updateSizes!.length; i++){
       updateSizes![i].qty = updateSizes![i].qty - item.qty[i].qty
      }
      item.textile.includes('#Безызбежно') ? await friends.findByIdAndUpdate(item._id, {product: { sizes: updateSizes }}) : await product.findByIdAndUpdate(item._id, {sizes: updateSizes});
    })
  }
  catch{
    throw new Error("Ошибка изменения остатков");
  }
}
