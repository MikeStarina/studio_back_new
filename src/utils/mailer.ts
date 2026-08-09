import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
export const MAIL_LOGIN = (process.env.MAIL_LOGIN || "").toString();
export const MAIL_PASS = (process.env.MAIL_PASS || "").toString();

type TMailData = {
  to: string;
  subject: string;
  payload: string;
  html?: string;
};

export const sendMail = async (data: TMailData) => {
  const transporter = await nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: MAIL_LOGIN, // generated ethereal user - testAccount.user
      pass: MAIL_PASS, // generated ethereal password - testAccount.pass
    },
  });

  const mail = await transporter.sendMail({
    from: "noreply@pnhd.ru",
    to: data.to,
    subject: data.subject,
    text: data.payload,
    html: data.html,
  });

  //console.log(mail);
};
