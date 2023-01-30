import nodemailer from 'nodemailer';
import { MAIL_LOGIN, MAIL_PASS } from '../app';


type TMailData = {
  to: string;
  subject: string;
}


export const sendMail = async (data: TMailData) => {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: MAIL_LOGIN ? MAIL_LOGIN : testAccount.user, // generated ethereal user
        pass: MAIL_PASS ? MAIL_PASS : testAccount.pass, // generated ethereal password
      },
    });

    const mail = await transporter.sendMail({
      from: "studio@pnhd.ru",
      to: "x@pnhd.ru",
      subject: data.subject,
      text: 'plain text'
    })

    console.log(mail);
}


