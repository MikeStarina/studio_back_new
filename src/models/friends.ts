import mongoose from "mongoose";

export interface IFriends {
  friend: string;
  products: [
    {
      name: string;
      description: string;
      type: string;
      price: number;
      color: string;
      category: string;
      image_url: string;
      shippingParams: {
        weight: number;
        width: number;
        length: number;
        depth: number;
      };
      galleryPhotos: string[];
      editor_front_view: string;
      editor_back_view: string;
      editor_lsleeve_view: string;
      editor_rsleeve_view: string;
      isForPrinting: boolean;
      sizes: Array<{name: string; qty: number;}>;
    }
  ];
}

const friendsSchema = new mongoose.Schema<IFriends>({
  friend: {type: String},
  products: [
    {
      name: {type: String},
      description: {type: String},
      type: {type: String},
      price: {type: Number},
      color: {type: String},
      category: {type: String},
      image_url: {type: String},
      shippingParams: {
        weight: {type: Number},
        width: {type: Number},
        length: {type: Number},
        depth: {type: Number},
      },
      galleryPhotos: [{type: String}],
      editor_front_view: {type: String},
      editor_back_view: {type: String},
      editor_lsleeve_view: {type: String},
      editor_rsleeve_view: {type: String},
      isForPrinting: {type: Boolean},
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
    },
  ],
})

export default mongoose.model<IFriends>("friends", friendsSchema);