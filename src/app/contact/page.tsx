import type { Metadata } from "next";
import { site, displayPhone, phoneHref } from "@/config/site";
import { ContactForm } from "@/components/forms/contact-form";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Let’s talk",
  description:
    "Tell us about your ISP’s day-to-day challenges. Talk to our team about a clearer way to manage your customers and network.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main">
      <section className="page-hero contact-hero">
        <div className="container">
          <span className="hero-label">
            <span className="pulse-dot" /> Real people. Useful conversations.
          </span>
          <h1>
            A better working day
            <br />
            <span>starts with a hello.</span>
          </h1>
          <p>
            A question, a challenge, or just a little curiosity.
            <br />
            We’re here for all of it.
          </p>
        </div>
      </section>
      <section className="contact-section">
        <div className="container contact-layout">
          <Reveal className="contact-information">
            <span className="eyebrow">Let’s figure it out together</span>
            <h2>
              Less back and forth.
              <br />
              More moving forward.
            </h2>
            <p>
              Tell us how your network works today and what you’d love to make
              simpler. We’ll start there.
            </p>
            <div className="contact-method">
              <span className="icon-tile">
                <Icon name="mail" />
              </span>
              <div>
                <h3>Drop us a line</h3>
                {site.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`}>
                    {email}
                    <Icon name="arrow" size={14} />
                  </a>
                ))}
              </div>
            </div>
            {site.phones.length > 0 && (
              <div className="contact-method">
                <span className="icon-tile">
                  <Icon name="phone" />
                </span>
                <div>
                  <h3>Sometimes, a call is easier</h3>
                  {site.phones.map((phone) => (
                    <a href={phoneHref(phone)} key={phone}>
                      {displayPhone(phone)}
                      <Icon name="arrow" size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {site.whatsapp && (
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                <Icon name="message" size={19} />
                <span>Prefer WhatsApp? Say hello.</span>
                <Icon name="arrow" size={17} />
              </a>
            )}
            <div className="contact-expectations">
              <h3>What happens next?</h3>
              <ol>
                <li>
                  <span>01</span>We read your message.
                </li>
                <li>
                  <span>02</span>We get to know your workflow.
                </li>
                <li>
                  <span>03</span>We find a useful next step, together.
                </li>
              </ol>
            </div>
          </Reveal>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
      <section className="contact-bottom">
        <div className="container">
          <Icon name="link" size={24} />
          <p>
            Behind the software, there are people.
            <br />
            <strong>We’re looking forward to meeting you.</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
