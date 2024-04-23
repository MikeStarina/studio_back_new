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
import { errorHandler } from "./middlewares/errors";
import { requestLogger, errorLogger } from "./middlewares/logger";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { errors } from "celebrate";
import { getCdekToken } from "./utils/cdek-token";
import { getYandexArtToken } from "./utils/yandex-art-token";
import clearImage from "./utils/clear-image";
import bodyParser from "body-parser";

const ENV = dotenv.config();

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
};

/**
 *   origin: [
    "https://pnhdstudioapi.ru",
    "https://studio.pnhd.ru",
    "https://www.studio.pnhd.ru",
    "http://127.0.0.1:1337",
    "http://95.163.236.13:3000",
    "http://studio.pnhd.ru",
    "http://95.163.236.13",
    "http://localhost:3000",
    "http://localhost:1337",
    "http://195.210.2.174:80",// сервер 1с
    "http://195.210.2.174:8080", // сервер 1с
    "https://vishivka.online",// сервер 1с
    "*"
  ],
 */

export const PORT = parseInt(ENV.parsed!.PORT);
export const DBURL = ENV.parsed!.DBURL.toString();
export const STOCK_TOKEN = ENV.parsed!.STOCK_TOKEN.toString();
export const YANDEX_CATALOG_ID = ENV.parsed!.YANDEX_CATALOG_ID;

//console.log(DBURL);
//!Ghjlerwbz1
//mikeTheAdmin

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));

mongoose.set("strictQuery", true);
mongoose.connect(DBURL, { dbName: "studio" });

app.use(requestLogger);
(() => clearImage())();
(async () => await getCdekToken())();
(async () => await getYandexArtToken())();

app.use("/api/shipping", shippingRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/leads", leadRouter);
app.use("/api/promocodes", promocodeRouter);
app.use("/api/friends", friendsRouter);
app.use(fileUpload());
app.use("/api/uploads", uploadRouter);
app.use('/api/blogs', blogsRouter);

app.use('/api/stock', stockRouter);
app.use('/api/generate', aIrouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
