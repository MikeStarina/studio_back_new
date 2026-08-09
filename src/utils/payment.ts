import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
export const PAYMENT_AUTH = (process.env.PAYMENT_AUTH || '').toString();


export const paymentRequest = async (paymentData: any) => {
  const authData = Buffer.from(PAYMENT_AUTH).toString('base64');

  try {



    const res = await fetch('https://api.yookassa.ru/v3/payments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + authData,
        'Idempotence-Key': paymentData.metadata.id,
      },
      body: JSON.stringify(paymentData),
    })

    const resData: any = await res.json();
    const paymentUrl = await resData.confirmation.confirmation_url;
    //const paymentUrl = 'https://ya.ru'
    return paymentUrl;

  }
  catch(e) {

  }

}