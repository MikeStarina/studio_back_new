interface IReceiptItems{
  description: string,
  quantity: number,
  amount: {
    value: number,
    currency: string,
  },
  vat_code: string,
  payment_mode: string,
  payment_subject: string,
}

interface IOrderItem {
      textile: String;
      qty: [{
        name:string;
        qty: number;
        _id: string;
      }];
      link:[string];
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
      isPrint? : boolean;
}

interface IMailOrderdata{
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  isShipping: boolean,
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
  shipping_price: number;
  order_details: [
    {
      textile: String;
      qty: [{
        name:string;
        qty: number;
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
}

export {
  IReceiptItems, IOrderItem, IMailOrderdata
};