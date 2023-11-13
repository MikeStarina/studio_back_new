import mongoose from "mongoose";

interface IBlog {
  title: String;
  slug: String;
  created: String;
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
  created: {
    type: String,
    required: true,
  },
  blog: [],
});

export default mongoose.model<IBlog>("blog", blogSchema);
