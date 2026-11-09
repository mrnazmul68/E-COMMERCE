import { createTransport } from "nodemailer";

export const sendMail = async (
  email: string,
  subject: string,
  html: string,
) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMTP_USER_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transport.sendMail({
    from: process.env.SMTP_USER_EMAIL,
    to: email,
    subject,
    html,
  });
};
