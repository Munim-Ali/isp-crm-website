import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { problems, steps } from "@/content/marketing";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/motion/reveal";
import { ConnectionSculpture } from "@/components/motion/connection-sculpture";
import { ProductShowcase } from "@/components/product/product-showcase";
import { Faq } from "@/components/sections/faq";
import { CallToAction } from "@/components/sections/cta";

export const metadata: Metadata = { alternates: { canonical: "/" } };

function CustomerStory() {
  return (
    <div className="customer-visual">
      <div className="visual-grid" aria-hidden="true" />
      <div className="customer-card">
        <div className="customer-card__top">
          <span className="avatar avatar--large avatar--blue">AH</span>
          <span className="status-pill">
            <i /> Active connection
          </span>
        </div>
        <h3>Ahmed Hassan</h3>
        <p>A person, with a whole story.</p>
        <div className="customer-detail">
          <span>
            <Icon name="package" size={16} /> Package
          </span>
          <strong>Home 30 Mbps</strong>
        </div>
        <div className="customer-detail">
          <span>
            <Icon name="map" size={16} /> Service area
          </span>
          <strong>Gulberg</strong>
        </div>
        <div className="customer-detail">
          <span>
            <Icon name="network" size={16} /> Dealer
          </span>
          <strong>Connected to their record</strong>
        </div>
        <div className="customer-card__foot">
          <Icon name="shield" size={14} /> The right details. In the right
          hands.
        </div>
      </div>
      <span className="floating-chip floating-chip--one">
        <span className="chip-icon">
          <Icon name="link" size={16} />
        </span>{" "}
        Everything connected.
      </span>
      <span className="floating-chip floating-chip--two">
        <span className="chip-check">
          <Icon name="check" size={13} />
        </span>{" "}
        One complete picture
      </span>
      <small className="visual-disclaimer">Illustrative customer record</small>
    </div>
  );
}

export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="hero__light" aria-hidden="true" />
        <Reveal className="container hero__content">
          <div className="hero-label">
            <span className="pulse-dot" /> A calmer way to run your ISP{" "}
            <span className="label-separator" />
            <Icon name="arrow" size={14} />
          </div>
          <h1>
            Less chasing details.
            <br />
            More <span>human connections.</span>
          </h1>
          <p className="hero__description">
            Your network connects people. Your workspace should too.
            <br className="desktop-break" /> Bring your customers, team, and all
            the little details together.
            <br className="desktop-break" /> So you can focus on the
            relationships that keep you growing.
          </p>
          <div className="hero__actions">
            <ButtonLink href="/contact">Let’s simplify your day</ButtonLink>
            <ButtonLink href="#workspace" variant="secondary" arrow={false}>
              <span className="play-icon" aria-hidden="true">
                ▷
              </span>{" "}
              Take a look inside
            </ButtonLink>
          </div>
          <div className="hero__promises">
            <span>
              <Icon name="check" size={14} /> Built around your customers
            </span>
            <span>
              <Icon name="check" size={14} /> Clearer for your team
            </span>
            <span>
              <Icon name="check" size={14} /> Room to grow
            </span>
          </div>
        </Reveal>
        <div className="container hero__preview" id="workspace">
          <Reveal>
            <ProductShowcase name={site.name} previews={site.previews} />
          </Reveal>
        </div>
      </section>
      <section className="connection-strip">
        <div className="container">
          <p>Behind every connection, there’s a relationship worth keeping.</p>
          <div className="connection-strip__items">
            <span>
              <Icon name="users" /> Your customers
            </span>
            <span className="connection-line" />
            <span>
              <Icon name="network" /> Your dealers
            </span>
            <span className="connection-line" />
            <span>
              <Icon name="shield" /> Your people
            </span>
            <span className="connection-line" />
            <span>
              <Icon name="globe" /> Your network
            </span>
          </div>
        </div>
      </section>
      <section id="why-us" className="section problems-section">
        <div className="container">
          <Reveal className="section-heading section-heading--center">
            <span className="eyebrow">
              <span className="tiny-square" /> Sound a little too familiar?
            </span>
            <h2>
              Growing a network is hard.
              <br />
              <span>Managing it shouldn’t be.</span>
            </h2>
            <p>
              It’s rarely one big thing. It’s the little things, scattered
              everywhere,
              <br className="desktop-break" /> that get between your team and a
              better customer experience.
            </p>
          </Reveal>
          <div className="problem-grid">
            {problems.map((problem, index) => (
              <Reveal key={problem.number} delay={index * 0.07}>
                <article className="problem-card">
                  <div className="problem-card__top">
                    <span className="icon-tile">
                      <Icon name={problem.icon} />
                    </span>
                    <span>{problem.number}</span>
                  </div>
                  <h3>{problem.title}</h3>
                  <p>{problem.text}</p>
                  <div className="problem-card__resolution">
                    <Icon name="arrow" size={16} />
                    <span>{problem.resolution}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section story-section">
        <div className="container feature-row">
          <Reveal>
            <CustomerStory />
          </Reveal>
          <Reveal className="feature-copy">
            <span className="eyebrow">Less searching. More understanding.</span>
            <h2>
              Remember the person.
              <br />
              <span>
                Not where you saved
                <br className="desktop-break" /> their details.
              </span>
            </h2>
            <p>
              A better customer experience starts with knowing the whole story.
              Give every connection a home, with the details your team needs in
              one clear record.
            </p>
            <ul className="feature-list">
              <li>
                <Icon name="check" size={16} />
                <span>Customer details, without the detective work.</span>
              </li>
              <li>
                <Icon name="check" size={16} />
                <span>Packages, areas, and dealers, connected.</span>
              </li>
              <li>
                <Icon name="check" size={16} />
                <span>Connection information you can actually find.</span>
              </li>
            </ul>
            <ButtonLink href="/contact" variant="text">
              See how it fits your network
            </ButtonLink>
          </Reveal>
        </div>
      </section>
      <section className="section team-section">
        <div className="container feature-row feature-row--reverse">
          <Reveal className="feature-copy">
            <span className="eyebrow">One team. The same picture.</span>
            <h2>
              When your people
              <br />
              connect,{" "}
              <span>
                everything
                <br className="desktop-break" /> works better.
              </span>
            </h2>
            <p>
              Your customer shouldn’t have to repeat their story. And your team
              shouldn’t have to ask around for it. Share the right information
              with the right people.
            </p>
            <div className="team-benefits">
              <div>
                <span className="icon-tile icon-tile--small">
                  <Icon name="shield" size={18} />
                </span>
                <div>
                  <h3>Trust your team. Set clear boundaries.</h3>
                  <p>Role-based access, specific to each organization.</p>
                </div>
              </div>
              <div>
                <span className="icon-tile icon-tile--small">
                  <Icon name="layers" size={18} />
                </span>
                <div>
                  <h3>Different organizations. Less confusion.</h3>
                  <p>Each workspace keeps its own customer records.</p>
                </div>
              </div>
            </div>
            <ButtonLink href="/about" variant="text">
              Meet the thinking behind {site.name}
            </ButtonLink>
          </Reveal>
          <Reveal>
            <div className="team-visual">
              <Image
                src={site.images.team}
                alt="A team working through ideas together at a shared table"
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <div className="team-visual__shade" />
              <div className="team-visual__card">
                <span className="stacked-avatars">
                  <span className="avatar avatar--purple">AK</span>
                  <span className="avatar avatar--blue">BA</span>
                  <span className="avatar avatar--orange">HR</span>
                </span>
                <span>
                  <strong>
                    Different roles.
                    <br />
                    One shared understanding.
                  </strong>
                  <small>Illustrative team</small>
                </span>
                <Icon name="link" size={23} />
              </div>
              <span className="photo-credit">
                Demo imagery · Your team’s story comes next
              </span>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section timeline-section" id="how-it-works">
        <div className="container">
          <Reveal className="section-heading section-heading--center">
            <span className="eyebrow">
              <Icon name="workflow" size={15} /> A little structure. A lot more
              clarity.
            </span>
            <h2>
              From scattered to in sync.
              <br />
              <span>One step at a time.</span>
            </h2>
            <p>
              No need to rethink your whole business.
              <br />
              Start with the people, places, and packages you already know.
            </p>
          </Reveal>
          <ol className="timeline">
            {steps.map((step, index) => (
              <li key={step.number}>
                <Reveal delay={index * 0.06}>
                  <div className="timeline__marker">
                    <span>{step.number}</span>
                    <i />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <span className="timeline__tag">
                    <Icon name="check" size={13} />
                    {step.tag}
                  </span>
                </Reveal>
              </li>
            ))}
          </ol>
          <div className="timeline-footer">
            <span>Let’s map out what this looks like for you.</span>
            <ButtonLink href="/contact" variant="text">
              Walk us through your day
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="section relationship-section">
        <div className="container relationship-panel">
          <Reveal>
            <span className="eyebrow">The point is people</span>
            <h2>
              A customer isn’t a row.
              <br />A team isn’t a list.
              <br />
              <span>A network is a community.</span>
            </h2>
            <p>We’re here to help you look after it.</p>
            <ButtonLink href="/about" variant="secondary">
              A little more about us
            </ButtonLink>
          </Reveal>
          <ConnectionSculpture />
        </div>
      </section>
      <Faq />
      <CallToAction />
    </main>
  );
}
