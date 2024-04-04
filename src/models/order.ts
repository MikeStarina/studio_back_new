import mongoose from "mongoose";

export interface IOrder {
  order_key: String;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  total_price: number;
  promocode: {
    discount_ratio:number;
    discounted_item: string;
    mechanic: string;
    message: string;
    name: string;
    qty:number;
    _id: string;
  };
  discounted_price: number;
  shipping: string;
  isShipping: boolean;
  shipping_city: {
    code: number;
    city_uuid: string;
    city: string;
    kladr_code: string;
    country_code: string;
    country: string;
    region: string;
    region_code: number;
    longitude: number;
    latitude: number;
    time_zone: string;
    payment_limit: number;
  };
  shipping_point: {
    code: string;
    name: string;
    uuid: string;
    address_comment: string;
    nearest_station: string;
    work_time: string;
    phones: [
      {
        number: string;
      }
    ];
    note: string;
    type: string;
    owner_code: string;
    take_only: boolean;
    is_handout: boolean;
    is_reception: boolean;
    is_dressing_room: boolean;
    is_ltl: boolean;
    have_cashless: boolean;
    have_cash: boolean;
    allowed_cod: boolean;
    office_image_list: [
      {
        url: string;
      }
    ];
    work_time_list: [
      {
        day: number;
        time: string;
      }
    ];
    weight_min: number;
    weight_max: number;
    dimensions: [
      {
        width: number;
        height: number;
        depth: number;
      }
    ];
    location: {
      country_code: string;
      region_code: number;
      region: string;
      city_code: number;
      city: string;
      fias_guid: string;
      postal_code: string;
      longitude: number;
      latitude: number;
      address: string;
      address_full: string;
    };
    fulfillment: boolean;
  };
  packages: [{ height: string; length: string; weight: string; width: string }];
  shipping_price: number;
  order_status: string;
  createdAt: Date;
  comment: string;
  order_details: [
    {
      type: string;
      links: [];
      textile: string;
      qty: [{
        name:string;
        qty: number;
        userQty: number;
        _id: string;
      }];
      qtyAll: number;
      item_price: number;
      print: boolean;
      printPrice: number;
      front_print?: string;
      back_print?: string;
      lsleeve_print?: string;
      rsleeve_print?: string;

      category: string;
      color: string;
      description: string;
      editor_back_view: string;
      editor_front_view: string;
      editor_lsleeve_view: string;
      editor_rsleeve_view: string;
      galleryPhotos:[string];
      image_url: string;
      isForPrinting: boolean;
      isSale: boolean;
      name: string;
      sizes: [{
        name:string;
        qty: number;
        _id: string;
      }];
      stock: string;
      _id: string;
    }
  ];
  isPayed: boolean;
}

const orderSchema = new mongoose.Schema<IOrder>({
  order_key: { type: String, required: false },
  owner_name: { type: String, minlength: 1, maxlength: 40, required: false},
  owner_phone: { type: String, required: false },
  owner_email: { type: String, required: false },
  total_price: { type: Number, required: false },
  promocode: {
    discount_ratio:{ type: Number },
    discounted_item: { type: String },
    mechanic: { type: String },
    message: { type: String },
    name: { type: String },
    qty:{ type: Number },
    _id: { type: String },
  },
  discounted_price: { type: Number },
  shipping: {
    type: String,
    enum: ["Самовывоз из студии", "Доставка по СПБ", "Доставка по РФ"],
    required: false,
    default: "Самовывоз из студии",
  },
  isShipping: { type: Boolean, reuired: true },
  shipping_city: {
    code: { type: Number },
    city_uuid: { type: String },
    city: { type: String },
    kladr_code: { type: String },
    country_code: { type: String },
    country: { type: String },
    region: { type: String },
    region_code: { type: Number },
    longitude: { type: Number },
    latitude: { type: Number },
    time_zone: { type: String },
    payment_limit: { type: Number },
  },
  shipping_point: {
    code: { type: String, required: false  },
    name: { type: String, required: false  },
    uuid: { type: String, required: false  },
    address_comment: { type: String },
    nearest_station: { type: String },
    work_time: { type: String },
    phones: [
      {
        number: { type: String }
      }
    ],
    note: { type: String },
    type: { type: String },
    owner_code: { type: String },
    take_only: { type: Boolean },
    is_handout: { type: Boolean },
    is_reception: { type: Boolean },
    is_dressing_room: { type: Boolean },
    is_ltl: { type: Boolean },
    have_cashless: { type: Boolean },
    have_cash: { type: Boolean },
    allowed_cod: { type: Boolean },
    office_image_list: [
      {
        url: { type: String }
      }
    ],
    work_time_list: [
      {
        day: { type: Number },
        time: { type: String }
      }
    ],
    weight_min: { type: Number },
    weight_max: { type: Number },
    dimensions: [
      {
        width: { type: Number },
        height: { type: Number },
        depth: { type: Number }
      }
    ],
    location: {
      country_code: { type: String },
      region_code: { type: Number },
      region: { type: String },
      city_code: { type: String },
      city: { type: String },
      fias_guid: { type: String },
      postal_code: { type: String },
      longitude: { type: Number },
      latitude: { type: Number },
      address: { type: String },
      address_full: { type: String }
    },
    fulfillment: { type: Boolean },
  },
  packages: [
    {
      height: { type: String },
      length: { type: String },
      weight: { type: String },
      width: { type: String }
    }
  ],
  shipping_price: {type: Number},
  isPayed: { type: Boolean, default: false },
  order_status: { type: String, default: "created" },
  createdAt: { type: Date, default: Date.now() },
  comment: { type: String },
  order_details: [
    {

  links: [],
  type: {type:String},
      textile: { type: String },
      qty: [{
        name:{ type: String },
        qty: {type: Number},
        _id: { type: String },
      }],
      qtyAll: {type: Number},
      item_price: {type: Number},
      print: {type: Boolean},
      printPrice: {type: Number},
      front_print: { type: String },
      back_print: { type: String },
      lsleeve_print: { type: String },
      rsleeve_print: { type: String },

      category: { type: String },
      color: { type: String },
      description: { type: String },
      editor_back_view: { type: String },
      editor_front_view: { type: String },
      editor_lsleeve_view: { type: String },
      editor_rsleeve_view: { type: String },
      galleryPhotos:[{ type: String }],
      image_url: { type: String },
      isForPrinting: {type: Boolean},
      isSale: {type: Boolean},
      name: { type: String },
      sizes: [{
        name:{ type: String },
        qty: {type: Number},
        _id: { type: String },
      }],
      stock: { type: String },
      _id: { type: String },
    }
  ],
});

export default mongoose.model("order", orderSchema);
