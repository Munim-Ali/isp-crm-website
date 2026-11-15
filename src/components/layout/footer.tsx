import Link from "next/link";
import { site, displayPhone, phoneHref } from "@/config/site";
import { Brand } from "@/components/ui/brand";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Icon } from "@/components/ui/icon";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="newsletter-row">
          <div>
            <span className="eyebrow">A little clarity in your inbox</span>
            <h2>Better connections start here.</h2>
            <p>Product notes and practical ideas for a calmer working day.</p>
          </div>
          <NewsletterForm />
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand name={site.name} logo={site.logo} />
            <p>
              {site.tagline}
              <br />
              Built for the people behind the network.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/#why-us">Why {site.name}</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#faqs">Questions & answers</Link>
          </div>
          <div>
            <h3>Company</h3>
            <Link href="/about">About us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/contact">Book a walkthrough</Link>
          </div>
          <div className="footer-contact">
            <h3>Let’s connect</h3>
            {site.emails.map((email) => (
              <a href={`mailto:${email}`} key={email}>
                {email}
              </a>
            ))}
            {site.phones.map((phone) => (
              <a href={phoneHref(phone)} key={phone}>
                {displayPhone(phone)}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. Made for meaningful
            connections.
          </span>
          <span className="footer-note">
            <Icon name="globe" size={14} /> People first. Always.
          </span>
        </div>
      </div>
    </footer>
  );
}
