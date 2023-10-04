import nodemailer from "nodemailer";
const sendEmail = async (
  {
  to,
  bcc,
  cc,
  subject,
  text,
  html,
  attachments = []
} = {}
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"NACompany" <${process.env.EMAIL}>`,
    to,
    bcc,
    cc,
    subject,
    text,
    html,
    attachments,
  });
};	
export default sendEmail 