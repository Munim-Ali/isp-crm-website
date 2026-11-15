import { z } from "zod";

const email = z.email("Enter a valid email address.").max(254);
const honeypot = z.string().max(200).optional().default("");
export const newsletterSchema = z
  .object({
    email,
    consent: z.literal(true, {
      error: "Please agree to receive product updates.",
    }),
    website: honeypot,
  })
  .strict();
export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your name.")
      .max(80)
      .regex(/^[^\r\n]+$/, "Enter your name on one line."),
    email,
    company: z.string().trim().max(120).default(""),
    phone: z
      .string()
      .trim()
      .max(25)
      .regex(/^[+\d\s()-]*$/, "Please enter a valid phone number.")
      .default(""),
    networkSize: z.enum(
      [
        "Just getting started",
        "Under 500 customers",
        "500–2,000 customers",
        "2,000+ customers",
        "Prefer to discuss",
      ],
      { error: "Select the size of your network." },
    ),
    message: z
      .string()
      .trim()
      .min(20, "Tell us a little more (at least 20 characters).")
      .max(3000),
    consent: z.literal(true, {
      error: "Please agree so we can respond to your enquiry.",
    }),
    website: honeypot,
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export interface FormResponse {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}
