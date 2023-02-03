import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const ENV = dotenv.config();
export const MAIL_LOGIN = ENV.parsed!.MAIL_LOGIN.toString();
export const MAIL_PASS = ENV.parsed!.MAIL_PASS.toString();


type TMailData = {
  to: string;
  subject: string;
  payload: string;
}




export const sendMail = async (data: TMailData) => {



    const transporter = await nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: MAIL_LOGIN, // generated ethereal user - testAccount.user
        pass: MAIL_PASS // generated ethereal password - testAccount.pass
      },
    });



    const mail = await transporter.sendMail({
      from: "studio@pnhd.ru",
      to: data.to,
      subject: data.subject,
      text: data.payload
    })

    //console.log(mail);


}


