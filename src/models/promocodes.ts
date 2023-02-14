import mongoose from "mongoose";



interface IPromocode {
  name: String;
  mechanic: String;
  discounted_item: String;
  discount_ratio: Number;
  qty: Number;
  message: String
}



const promocode = new mongoose.Schema<IPromocode>({
  name: {
    type: String,
    require: true
  },
  mechanic: { type: String},
  discounted_item: {type: String},
  discount_ratio: { type: Number},
  qty: {type: Number},
  message: {type: String}
})




export default mongoose.model<IPromocode>('promocode', promocode);