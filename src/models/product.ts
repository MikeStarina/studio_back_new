import mongoose from "mongoose";



interface IProduct {
    name: String;
    description: String;
    links: String[],
    type: String;
    price: Number;
    weight: Number;
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
    sizes: Array<{name: String, amount: number}>;
    friends: String;
}


const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    links: [
        {
            type: String,
        }
    ],
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
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
            type: String
        }
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
                type: String
            },
            amount: {
                type: Number,
            },
        }
    ],
    friends: {
        type: String,
    }
})



export default mongoose.model<IProduct>('product', productSchema);

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