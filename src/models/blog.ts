import mongoose from "mongoose";

interface IBlog {
  title: String;
  slug: String;
  createdAt: Date;
  blog: [
    {subtitle?: String},
    {text?: String[]},
    {link?: String},
    {image?: String},
  ];
}

const blogSchema = new mongoose.Schema<IBlog>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  blog: [],
});

export default mongoose.model<IBlog>("blog", blogSchema);
