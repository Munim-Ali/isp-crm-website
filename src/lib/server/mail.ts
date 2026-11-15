import "server-only";
import nodemailer from "nodemailer";
import { z } from "zod";
import type { ContactInput, NewsletterInput } from "@/lib/validation";

const mailSchema = z.object({
  SMTP_HOST: z.string().trim().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_SECURE: z.enum(["true", "false"]),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM: z.email(),
  MAIL_TO: z
    .string()
    .transform((value) => value.split(",").map((email) => email.trim()))
    .pipe(z.array(z.email()).min(1).max(10)),
});

export class MailUnavailableError extends Error {
  constructor() {
    super("Email delivery is not configured.");
    this.name = "MailUnavailableError";
  }
}

function mailConfig() {
  const result = mailSchema.safeParse(process.env);
  if (!result.success) throw new MailUnavailableError();
  return result.data;
}

let cachedTransport: ReturnType<typeof nodemailer.createTransport> | undefined;

export async function deliverNotification(
  kind: "contact" | "newsletter",
  data: ContactInput | NewsletterInput,
) {
  const env = mailConfig();
  cachedTransport ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === "true",
    requireTLS: env.SMTP_SECURE !== "true",
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  const contact = kind === "contact" ? (data as ContactInput) : undefined;
  const text = contact
    ? [
        "New website enquiry",
        "",
        `Name: ${contact.name}`,
        `Email: ${contact.email}`,
        `Company: ${contact.company || "Not provided"}`,
        `Phone: ${contact.phone || "Not provided"}`,
        `Network size: ${contact.networkSize}`,
        "",
        "Message:",
        contact.message,
        "",
        "The sender agreed to be contacted about this enquiry.",
      ].join("\n")
    : [
        "New newsletter signup",
        "",
        `Email: ${data.email}`,
        "",
        "The subscriber opted in to receive product updates.",
        "This notification is not an automated mailing-list integration. Add the address to your newsletter provider using its consent process.",
      ].join("\n");

  const result = await cachedTransport.sendMail({
    from: {
      name: process.env.COMPANY_NAME || "Website",
      address: env.SMTP_FROM,
    },
    to: env.MAIL_TO,
    replyTo: data.email,
    subject: contact ? "New website enquiry" : "New newsletter signup",
    text,
  });
  // A partial SMTP acceptance is not reported to the visitor as full success.
  if (result.rejected?.length || result.accepted?.length !== env.MAIL_TO.length)
    throw new Error("SMTP delivery was not accepted for every recipient.");
}
