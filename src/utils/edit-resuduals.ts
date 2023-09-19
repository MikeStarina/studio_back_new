import product from "../models/product";
import friends from '../models/friends';
import ServerError from "./server-error-class";
import { TOrderDetailsData, TOrdersDetailsFriend } from "../types/resudals";


export const editResiduals = async <TOrderDetailsData, TOrdersDetailsFriend extends keyof TOrderDetailsData> (arr: TOrderDetailsData | undefined) => {
  try{
    //@ts-ignore
    arr?.forEach(async (item)=>{
      const currentProduct = item.textile.includes('#Безызбежно') ? await friends.findOne({ friend: "zagitova"}) : await product.findById(item._id);
      console.log(currentProduct)
      if(!currentProduct){
        throw ServerError.error400(
          "Неверный id товара."
        );
      }
      //@ts-ignore
      let updateSizes = item.textile.includes('#Безызбежно') ? currentProduct?.products[0].sizes : currentProduct?.sizes;
      console.log(updateSizes, '1');
      for(let i = 0; i<updateSizes!.length; i++){
       updateSizes![i].qty = updateSizes![i].qty - item.qty[i].qty
      }
      console.log(updateSizes, '2');
      item.textile.includes('#Безызбежно') ? await friends.findOneAndUpdate({ friend: "zagitova" }, { product: { sizes: updateSizes } }) : await product.findByIdAndUpdate(item._id, {sizes: updateSizes});
    })
  }
  catch{
    throw new Error("Ошибка изменения остатков");
  }
}
