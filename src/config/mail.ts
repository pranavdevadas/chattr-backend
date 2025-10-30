import nodemailer from "nodemailer";
import sgMail from '@sendgrid/mail'
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const transporter = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST,
  // port: Number(process.env.EMAIL_PORT),
  // service: "gmail",
  // secure: false,
  // auth: {
  //   user: "pranavdevadas2@gmail.com",
  //   pass: "petd siof jlcc stcl",
  // },
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "9a6041001@smtp-brevo.com", 
    pass: "Hr9tB2xYIqVWa3jd",
  },
});

// export const sendMail = async (to: string, subject: string, text: string) => {
//   try {   
//     let mail = await transporter.sendMail({
//       from: `"Chattr" <pranavdevadas2@gmail.com>`,
//       to,
//       subject,
//       text,
//     });
//     console.log('mail', mail);
//   } catch (err: any) {
//     console.error("Error sending email:", err.message);
//     throw new Error("Failed to send email");
//   }
// };

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const msg = {
      to,
      from: 'no-reply@chattr.com', // This must match a verified sender domain in SendGrid
      subject,
      text,
    };

    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response[0].statusCode);
  } catch (err: any) {
    console.error('Error sending email:', err.response?.body || err.message);
    throw new Error('Failed to send email');
  }
};