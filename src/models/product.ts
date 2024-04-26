import mongoose from "mongoose";

interface IProduct {
  slug: String;
  name: String;
  oneCCode: String;
  description: String;
  links: String[];
  type: String;
  price: Number;
  shippingParams: {
    weight: Number;
    width: Number;
    length: Number;
    depth: Number;
  };
  stock: String;
  color: String;
  category: String;
  isSale: boolean;
  isForPrinting: boolean;
  image_url: String;
  galleryPhotos: String[];
  editor_front_view: String;
  editor_back_view: String;
  editor_lsleeve_view: String;
  editor_rsleeve_view: String;
  sizes: Array<{ name: String; qty: number }>;
  friends: String;
}

const productSchema = new mongoose.Schema<IProduct>({
  slug: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  oneCCode: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  links: [
    {
      type: String,
    },
  ],
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shippingParams: {
    weight: { type: Number, required: false },
    width: { type: Number, required: false },
    length: { type: Number, required: false },
    depth: { type: Number, required: false },
  },
  stock: {
    type: String,
    default: "studio", //supplier
  },
  color: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isSale: {
    type: Boolean,
    default: false,
  },
  isForPrinting: {
    type: Boolean,
    default: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  galleryPhotos: [
    {
      type: String,
    },
  ],
  editor_front_view: {
    type: String,
  },
  editor_back_view: {
    type: String,
  },
  editor_lsleeve_view: {
    type: String,
  },
  editor_rsleeve_view: {
    type: String,
  },
  sizes: [
    {
      name: {
        type: String,
      },
      qty: {
        type: Number,
      },
    },
  ],
  friends: {
    type: String,
  },
});

export default mongoose.model<IProduct>("product", productSchema);

/*
{
  "_id": {
    "$oid": "63d55260daff3d800c44e1ba"
  },
  "shipping": "Самовывоз из студии",
  "isPayed": false,
  "order_details": [],
  "__v": 0
}

*/

/*
  "shippingParams": {
    "weight": 300,
    "width": 22,
    "length": 16,
    "depth": 8
  },


  "shippingParams": {
    "weight": 900,
    "width": 32,
    "length": 22,
    "depth": 10
  },
*/
