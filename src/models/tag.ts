import mongoose from "mongoose";

interface ITag {
  label: string;
  slug: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const tagSchema = new mongoose.Schema<ITag>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITag>("tag", tagSchema);
