import nodemailer from "nodemailer";
import { env } from "../common/config/env";
import logger from "../common/config/logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  logger.info(`Email sent to: ${to}`);
  return transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}

export async function sendEmailWithAttachments(
  to: string,
  subject: string,
  html: string,
  attachment: { filename: string; content: any }
) {
  logger.info(`Email with attachment sent to: ${to}`);
  return transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
    attachments: [attachment],
  });
}
