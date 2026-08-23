import mongoose from "mongoose";
import { rewriteLegacyMediaUrl } from "../utils/media-url";

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
  blog: { __html: string };
  isActive: boolean;
}

const blogSchema = new mongoose.Schema<IBlog>({
  post_id: {
    type: Number,
    required: true,
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
    default: 0,
  },
  hashtags: {
    type: [String],
    default: [],
  },
  blog: {
    type: { __html: String },
    required: true,
  },
  author: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const rewriteCover = (_doc: unknown, ret: { cover?: string }) => {
  if (typeof ret.cover === "string") {
    ret.cover = rewriteLegacyMediaUrl(ret.cover);
  }
  return ret;
};

blogSchema.set("toJSON", { transform: rewriteCover });
blogSchema.set("toObject", { transform: rewriteCover });

export default mongoose.model<IBlog>("blog", blogSchema);
