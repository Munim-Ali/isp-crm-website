import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";

export function CallToAction() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-panel">
          <div className="cta-orbit" aria-hidden="true" />
          <span className="eyebrow eyebrow--light">
            <Icon name="link" size={15} /> Let’s make things simpler
          </span>
          <h2>
            Your next chapter.
            <br />
            Better connected.
          </h2>
          <p>
            Tell us what’s getting in the way.
            <br />
            We’ll show you what a clearer working day could look like.
          </p>
          <ButtonLink href="/contact" variant="light">
            Let’s talk about your network
          </ButtonLink>
          <span className="cta-footnote">
            A real conversation. A walkthrough built around you.
          </span>
        </div>
      </div>
    </section>
  );
}
