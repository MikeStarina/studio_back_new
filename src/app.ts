import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/products';
import orderRouter from './routes/orders';
import paymentRouter from './routes/payment';
import uploadRouter from './routes/uploads';
import leadRouter from './routes/lead';
import { errorHandler } from './middlewares/errors';
import { requestLogger, errorLogger } from './middlewares/logger';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';



const ENV = dotenv.config();


const corsOptions = {
    origin: 'https://www.studio.pnhd.ru',
    optionsSuccessStatus: 200,
  }




export const PORT = parseInt(ENV.parsed!.PORT);
export const DBURL = ENV.parsed!.DBURL.toString();


//console.log(DBURL);



const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')));

mongoose.set('strictQuery', true);
mongoose.connect(DBURL);


app.use(requestLogger);

app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/leads', leadRouter)
app.use(fileUpload());
app.use('/api/uploads', uploadRouter)




app.use(errorLogger);
app.use(errorHandler)

app.listen(+PORT, () => {
    console.log(`App listening on port ${PORT}`)
});


