"use client";

import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { useSubmission } from "./use-submission";

export function NewsletterForm() {
  const { pending, result, submit } = useSubmission("/api/newsletter");
  return (
    <form
      className="newsletter-form"
      onSubmit={submit}
      aria-label="Newsletter signup"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Your email address
      </label>
      <div className="newsletter-form__input">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          maxLength={254}
          required
          disabled={pending}
        />
        <button
          type="submit"
          className="button button--primary"
          disabled={pending}
        >
          {pending ? "Sending…" : "Subscribe"}
          {pending ? (
            <LoaderCircle className="spinner" size={17} />
          ) : (
            <ArrowUpRight size={17} />
          )}
        </button>
      </div>
      <div className="form-trap" aria-hidden="true">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="checkbox-label">
        <input type="checkbox" name="consent" required disabled={pending} />
        <span>
          I agree to receive product updates. Unsubscribe anytime by email.
        </span>
      </label>
      <p
        className={`form-result${result?.ok ? " form-result--success" : ""}`}
        aria-live="polite"
        role="status"
      >
        {result?.message}
      </p>
    </form>
  );
}
