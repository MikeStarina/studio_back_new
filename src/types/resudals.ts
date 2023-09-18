type TOrderDetailsData =[
  {
    links:[];
    type:string;
    textile: string;
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
]

export { TOrderDetailsData };