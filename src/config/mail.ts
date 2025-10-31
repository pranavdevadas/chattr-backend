import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  service: "gmail",
  secure: false,
  auth: {
    user: "pranavdevadas2@gmail.com",
    pass: "petd siof jlcc stcl",
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: `"MyApp" <pranavdevadas2@gmail.com>`,
    to,
    subject,
    text,
  });
};

