import nodemailer from "nodemailer";

export const sendEmail = async (email: string, subject: string, content: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
      user: process.env.NM_GMAIL_FROM,
      pass: process.env.NM_GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.NM_GMAIL_FROM,
      to: email,
      subject,
      html: content,
    });
  } catch (error) {
    console.error(error);

    throw new Error("Failed to send email");
  }
};
