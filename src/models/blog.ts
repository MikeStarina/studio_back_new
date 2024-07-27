import mongoose from "mongoose";

interface IBlog {
  post_id: number;
  title: string;
  subtitle: string;
  slug: string;
  createdAt: string;
  cover: string;
  likes: number;
  hashtags: Array<string>;
  author: string;
  blog: {__html: string}
}

const blogSchema = new mongoose.Schema<IBlog>({
  post_id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
  },
  cover: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0
  },
  hashtags: {
    type: [],
    required: true,
  },
  blog: {
    type: {__html: String},
    required: true
  },
  author: {
    type: String,
  }
});

export default mongoose.model<IBlog>("blog", blogSchema);
