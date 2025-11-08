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

export const sendMail = async (
  to: string,
  subject: string,
  otp: number,
) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7B3FD3 0%, #5A0FC8 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Chattr</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Verify Your Account</h2>
        
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Welcome to Chattr! Please use the following OTP to verify your account:
        </p>
        
        <div style="background: white; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #667eea;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${otp}</div>
        </div>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't request this verification, please ignore this email.
        </p>
      </div>
      
      <div style="background: #333; padding: 20px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 14px;">
          &copy; 2024 Chattr. All rights reserved.
        </p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: `"Chattr" <pranavdevadas2@gmail.com>`,
    to,
    subject,
    text: `Your Chattr otp is : ${otp}`,
    html: htmlTemplate,
  });
};
