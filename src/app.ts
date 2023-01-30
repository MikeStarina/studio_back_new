import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/products';
import orderRouter from './routes/orders';
import paymentRouter from './routes/payment';
import uploadRouter from './routes/uploads';
import { errorHandler } from './middlewares/errors';
import { requestLogger, errorLogger } from './middlewares/logger';

import dotenv from 'dotenv';
const ENV = dotenv.config();




export const PORT = parseInt(ENV.parsed!.PORT);
export const DBURL = ENV.parsed!.DBURL.toString();
export const { MAIL_LOGIN, MAIL_PASS } = process.env;
export const PAYMENT_AUTH = ENV.parsed!.PAYMENT_AUTH.toString();
console.log(typeof PORT);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')));
//console.log(path.join(__dirname, 'public'));
app.use('static', express.static('public'));

mongoose.set('strictQuery', true);
mongoose.connect(DBURL);


app.use(requestLogger);

app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/uploads', uploadRouter);



app.use(errorLogger);
app.use(errorHandler)

app.listen(+PORT, () => {
    console.log(`App listening on port ${PORT}`)
});


