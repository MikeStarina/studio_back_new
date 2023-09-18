import product from "../models/product";
import ServerError from "./server-error-class";
import { TOrderDetailsData } from "../types/resudals";


export const editResiduals = (arr: TOrderDetailsData | undefined)=>{
  try{
    arr?.forEach(async (item)=>{
      // console.log(item.qty)
      const currentProduct = await product.findById(item._id);
      if(!currentProduct){
        throw ServerError.error400(
          "Неверный id товара."
        );
      }
      let updateSizes = currentProduct?.sizes;
      for(let i = 0; i<updateSizes!.length; i++){
       updateSizes![i].qty = updateSizes![i].qty - item.qty[i].qty
      }
      await product.findByIdAndUpdate(item._id, {sizes: updateSizes});
    })
  }
  catch{
    throw new Error("Ошибка изменения остатков");
  }
}
