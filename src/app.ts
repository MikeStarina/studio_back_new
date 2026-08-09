import express from "express";
import mongoose from "mongoose";
import path from "path";
import productRouter from "./routes/products";
import orderRouter from "./routes/orders";
import paymentRouter from "./routes/payment";
import uploadRouter from "./routes/uploads";
import leadRouter from "./routes/lead";
import promocodeRouter from "./routes/promocodes";
import shippingRouter from "./routes/shipping";
import friendsRouter from "./routes/friends";
import blogsRouter from "./routes/blogs";
import stockRouter from './routes/stock'
import aIrouter from './routes/ai-generate';
import authRouter from './routes/auth';
import bannersRouter from "./routes/banners";
import categoriesRouter from "./routes/categories";
import tagsRouter from "./routes/tags";
import { errorHandler } from "./middlewares/errors";
import { requestLogger, errorLogger } from "./middlewares/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { errors } from "celebrate";
import { getCdekToken } from "./utils/cdek-token";
import { getYandexArtToken } from "./utils/yandex-art-token";
import clearImage from "./utils/clear-image";
import bodyParser from "body-parser";
import dealaddrouter from './routes/deal-add-hook';
import { FRONTEND_URL } from "./config";

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
};

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

export const PORT = parseInt(process.env.PORT || "8000", 10);
export const DBURL = requireEnv("DBURL");
export const STOCK_TOKEN = requireEnv("STOCK_TOKEN");
export const YANDEX_CATALOG_ID = process.env.YANDEX_CATALOG_ID || "";

//console.log(DBURL);
//!Ghjlerwbz1
//mikeTheAdmin

const app = express();
// Behind nginx/ Cloudflare so req.secure / protocol reflect the public HTTPS URL.
app.set("trust proxy", 1);
//app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));

mongoose.set("strictQuery", true);
mongoose.connect(DBURL, { dbName: "studio" });

app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, frontend: FRONTEND_URL });
});

(() => clearImage())();
(async () => {
  try {
    await getCdekToken();
  } catch (err) {
    console.error("CDEK token init failed:", err);
  }
})();
(async () => {
  try {
    await getYandexArtToken();
  } catch (err) {
    console.error("Yandex Art token init failed:", err);
  }
})();

app.use("/api/auth", authRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/leads", leadRouter);
app.use("/api/promocodes", promocodeRouter);
app.use("/api/friends", friendsRouter);
app.use(fileUpload());
app.use("/api/banners", bannersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/uploads", uploadRouter);
app.use('/api/blog', blogsRouter);
app.use('/api/dealadd', dealaddrouter);

app.use('/api/stock', stockRouter);
app.use('/api/generate', aIrouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
