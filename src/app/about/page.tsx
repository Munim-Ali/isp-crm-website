import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/config/site";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button-link";
import { CallToAction } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Meet the idea behind a calmer ISP workspace. We put people, clear information, and stronger customer relationships at the center.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main">
      <section className="page-hero about-hero">
        <div className="container">
          <span className="hero-label">
            <span className="pulse-dot" /> The people behind the idea
          </span>
          <h1>
            Good technology.
            <br />
            <span>Even better relationships.</span>
          </h1>
          <p>
            We believe running an ISP should leave you with more time
            <br className="desktop-break" /> for the people who rely on it.
            That’s why we’re building {site.name}.
          </p>
          <ButtonLink href="/contact">Get to know us</ButtonLink>
        </div>
      </section>
      <section className="about-photo-section">
        <div className="container">
          <div className="about-photo">
            <Image
              src={site.images.team}
              alt="People sharing ideas around a table in a bright workspace"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            <div className="about-photo__label">
              <Icon name="link" size={18} />
              <span>
                Built around people.
                <br />
                <strong>Always will be.</strong>
              </span>
            </div>
            <span className="photo-credit">Placeholder team photograph</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container about-story">
          <Reveal>
            <span className="eyebrow">Why we’re here</span>
            <h2>
              You built a network.
              <br />
              <span>Not an admin department.</span>
            </h2>
          </Reveal>
          <Reveal className="prose">
            <p>
              Somewhere between the new connections, the package changes, and
              the “can you check this customer?” messages, the small tasks start
              filling up the day.
            </p>
            <p>
              We’re building {site.name} around a simple idea: the information
              your team needs should be easy to find, easy to understand, and
              connected to the people it belongs to.
            </p>
            <p>
              Customers, areas, packages, dealers, and your team, in one
              organized workspace. So the people behind your network can spend
              less time chasing details and more time looking after the people
              using it.
            </p>
            <p className="prose-emphasis">
              The goal is a better working day. And a better relationship at the
              end of every connection.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section values-section">
        <div className="container">
          <Reveal className="section-heading section-heading--center">
            <span className="eyebrow">The things we won’t lose sight of</span>
            <h2>
              Simple principles.
              <br />
              <span>Real everyday difference.</span>
            </h2>
          </Reveal>
          <div className="values-grid">
            {[
              {
                icon: "users" as const,
                title: "People come first.",
                text: "Every record represents a person. We design around the moments when having the right information helps you look after them better.",
              },
              {
                icon: "layers" as const,
                title: "Clarity beats complexity.",
                text: "A useful workspace should make your day easier to understand. We focus on giving each detail a clear place and a clear purpose.",
              },
              {
                icon: "shield" as const,
                title: "Trust needs boundaries.",
                text: "Your organizations have their own records. Your people have their own roles. Thoughtful access is part of how teams work well together.",
              },
            ].map((value, index) => (
              <Reveal key={value.title} delay={index * 0.07}>
                <article className="value-card">
                  <span className="icon-tile">
                    <Icon name={value.icon} />
                  </span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container feature-row">
          <Reveal>
            <div className="workspace-photo">
              <Image
                src={site.images.story}
                alt="A bright, open workspace with natural light and plants"
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <span className="photo-credit">
                Placeholder workspace photograph
              </span>
            </div>
          </Reveal>
          <Reveal className="feature-copy">
            <span className="eyebrow">Built with your working day in mind</span>
            <h2>
              We’re at the beginning.
              <br />
              <span>
                Let’s shape what
                <br />
                comes next.
              </span>
            </h2>
            <p>
              The most useful conversations start with what’s difficult today.
              We want to hear about the spreadsheets, the handoffs, and the
              details that keep getting lost.
            </p>
            <p>
              Show us how you work. We’ll listen, walk you through the product,
              and talk honestly about where it can help.
            </p>
            <ButtonLink href="/contact" variant="text">
              Tell us your story
            </ButtonLink>
          </Reveal>
        </div>
      </section>
      <CallToAction />
    </main>
  );
}
