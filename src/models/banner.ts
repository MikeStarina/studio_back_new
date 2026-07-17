import mongoose from "mongoose";

interface IBanner {
  imageUrl: string;
  link: string;
  order: number;
  isActive: boolean;
}

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBanner>("banner", bannerSchema);
