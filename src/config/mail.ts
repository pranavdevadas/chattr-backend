import nodemailer from "nodemailer";

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

export const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: `"Chattr" <pranavdevadas2@gmail.com>`,
    to,
    subject,
    text,
  });
};
