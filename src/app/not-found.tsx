import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <div className="container">
        <span className="eyebrow">404 · A little off the map</span>
        <h1>
          Let’s get you
          <br />
          <span>connected again.</span>
        </h1>
        <p>We couldn’t find that page. Your next stop is right here.</p>
        <ButtonLink href="/">Back to the home page</ButtonLink>
      </div>
    </main>
  );
}
