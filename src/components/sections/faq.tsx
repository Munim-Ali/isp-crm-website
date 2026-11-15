import { faqs } from "@/content/marketing";
import { FaqAccordion } from "@/components/motion/faq-accordion";
import { ButtonLink } from "@/components/ui/button-link";

export function Faq() {
  return (
    <section id="faqs" className="section faq-section">
      <div className="container faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">A little more clarity</span>
          <h2>
            Good questions.
            <br />
            Straight answers.
          </h2>
          <p>
            Wondering how it all fits together?
            <br />
            Let’s clear a few things up.
          </p>
          <ButtonLink href="/contact" variant="text">
            Ask us something else
          </ButtonLink>
        </div>
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
