import type { Metadata } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = localFont({
  src: "../../public/fonts/inter-latin.woff2",
  display: "swap",
  variable: "--font-inter",
  weight: "400 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Better relationships. Stronger connections.`,
    template: `%s | ${site.name}`,
  },
  description:
    "Less chasing details. More human connections. Bring your ISP’s customers, packages, areas, dealers, and team together in one clear workspace.",
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: site.name,
    title: `${site.name} — Built around your customers`,
    description:
      "A calmer way to manage the people and details behind your network.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="site-layout">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
