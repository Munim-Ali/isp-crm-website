import "server-only";
import { z } from "zod";
import type { ProductPreview } from "@/types/product";

const optionalText = z.string().trim().default("");
const schema = z.object({
  COMPANY_NAME: z.string().trim().min(1).default("Relay"),
  COMPANY_TAGLINE: z
    .string()
    .default("Better relationships. Stronger connections."),
  COMPANY_LOGO: optionalText,
  SITE_URL: z.url().default("http://localhost:3000"),
  CONTACT_EMAIL: z.email().default("alirohan500@gmail.com"),
  CONTACT_EMAIL_SECONDARY: z.email().default("munimali52@gmail.com"),
  CONTACT_PHONE: optionalText,
  CONTACT_PHONE_SECONDARY: optionalText,
  WHATSAPP_NUMBER: optionalText,
  TEAM_IMAGE: z.string().default("/images/team.webp"),
  STORY_IMAGE: z.string().default("/images/workspace.webp"),
  PREVIEW_DASHBOARD_IMAGE: z.string().default("/images/product/dashboard.svg"),
  PREVIEW_CUSTOMERS_IMAGE: z.string().default("/images/product/customers.svg"),
  PREVIEW_RECORDS_IMAGE: z.string().default("/images/product/records.svg"),
  PREVIEW_USERS_IMAGE: z.string().default("/images/product/users.svg"),
  PREVIEW_PLANS_IMAGE: z.string().default("/images/product/plans.svg"),
});

const env = schema.parse(process.env);

export const site = {
  name: env.COMPANY_NAME,
  tagline: env.COMPANY_TAGLINE,
  logo: env.COMPANY_LOGO,
  url: env.SITE_URL,
  emails: [env.CONTACT_EMAIL, env.CONTACT_EMAIL_SECONDARY],
  phones: [env.CONTACT_PHONE, env.CONTACT_PHONE_SECONDARY].filter(Boolean),
  whatsapp: env.WHATSAPP_NUMBER
    ? `https://wa.me/${env.WHATSAPP_NUMBER.replace(/\D/g, "")}`
    : "",
  images: { team: env.TEAM_IMAGE, story: env.STORY_IMAGE },
  previews: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
      image: env.PREVIEW_DASHBOARD_IMAGE,
      eyebrow: "The bigger picture, without the busywork.",
      description:
        "See the customers, places, and plans that make up your network.",
    },
    {
      id: "customers",
      label: "Customers",
      icon: "users",
      image: env.PREVIEW_CUSTOMERS_IMAGE,
      eyebrow: "Find the person. Understand the connection.",
      description:
        "Customer details, service areas, and packages, in one clear view.",
    },
    {
      id: "records",
      label: "Records",
      icon: "database",
      image: env.PREVIEW_RECORDS_IMAGE,
      eyebrow: "Every detail has a home.",
      description:
        "Bring contact, package, dealer, and connection information together.",
    },
    {
      id: "users",
      label: "Users",
      icon: "shield",
      image: env.PREVIEW_USERS_IMAGE,
      eyebrow: "Different roles. The same understanding.",
      description:
        "Give the right people the access they need in each organization.",
    },
    {
      id: "plans",
      label: "Plans",
      icon: "package",
      image: env.PREVIEW_PLANS_IMAGE,
      eyebrow: "A plan for every kind of connection.",
      description:
        "Keep your internet packages and their customer records connected.",
    },
  ] satisfies ProductPreview[],
} as const;

export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
}

export function displayPhone(phone: string) {
  return phone.replace(/^(\d{4})(\d{7})$/, "$1 $2");
}
