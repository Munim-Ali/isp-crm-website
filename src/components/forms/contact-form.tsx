"use client";

import { ArrowUpRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { useSubmission } from "./use-submission";
import { contactSchema } from "@/lib/validation";

function FieldError({ name, message }: { name: string; message?: string }) {
  return (
    <span
      className="field-error"
      id={`contact-${name}-error`}
      aria-hidden={!message}
    >
      {message || "\u00a0"}
    </span>
  );
}

export function ContactForm() {
  const {
    pending,
    result,
    submit,
    fieldErrors: errors,
    validateField,
  } = useSubmission("/api/contact", contactSchema);
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      onBlurCapture={validateField}
      noValidate
      aria-label="Contact our team"
    >
      <div className="contact-form__heading">
        <span className="eyebrow">A conversation, not a sales pitch</span>
        <h2>What’s on your mind?</h2>
        <p>Tell us a little about your network. We’ll take it from there.</p>
      </div>
      <fieldset disabled={pending}>
        <legend className="sr-only">Your enquiry</legend>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="contact-name">
              Your name <span>*</span>
            </label>
            <input
              name="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              id="contact-name"
              placeholder="e.g. Ali Ahmed"
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
            />
            <FieldError name="name" message={errors.name} />
          </div>
          <div className="field">
            <label htmlFor="contact-email">
              Email address <span>*</span>
            </label>
            <input
              name="email"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
              id="contact-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              maxLength={254}
              required
            />
            <FieldError name="email" message={errors.email} />
          </div>
          <div className="field">
            <label htmlFor="contact-company">Company / ISP name</label>
            <input
              name="company"
              aria-invalid={!!errors.company}
              aria-describedby={
                errors.company ? "contact-company-error" : undefined
              }
              id="contact-company"
              placeholder="Your network’s name"
              autoComplete="organization"
              maxLength={120}
            />
            <FieldError name="company" message={errors.company} />
          </div>
          <div className="field">
            <label htmlFor="contact-phone">Phone number</label>
            <input
              name="phone"
              aria-invalid={!!errors.phone}
              aria-describedby={
                errors.phone ? "contact-phone-error" : undefined
              }
              id="contact-phone"
              type="tel"
              placeholder="03XX XXXXXXX"
              autoComplete="tel"
              maxLength={25}
            />
            <FieldError name="phone" message={errors.phone} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="contact-size">
            How big is your network? <span>*</span>
          </label>
          <select
            id="contact-size"
            name="networkSize"
            required
            defaultValue=""
            aria-invalid={!!errors.networkSize}
            aria-describedby={
              errors.networkSize ? "contact-networkSize-error" : undefined
            }
          >
            <option value="" disabled>
              Select your customer base
            </option>
            {[
              "Just getting started",
              "Under 500 customers",
              "500–2,000 customers",
              "2,000+ customers",
              "Prefer to discuss",
            ].map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
          <FieldError name="networkSize" message={errors.networkSize} />
        </div>
        <div className="field">
          <label htmlFor="contact-message">
            What would you like to make simpler? <span>*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            aria-invalid={!!errors.message}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            rows={5}
            placeholder="Tell us about your day-to-day challenges, or ask us a question…"
            minLength={20}
            maxLength={3000}
            required
          />
          <FieldError name="message" message={errors.message} />
          <small>A little context helps us give you a useful answer.</small>
        </div>
        <div className="form-trap" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={!!errors.consent}
            aria-describedby={
              errors.consent ? "contact-consent-error" : undefined
            }
          />
          <span>
            I agree to be contacted about this enquiry. My details won’t be sold
            or used for unrelated marketing.
          </span>
        </label>
        <FieldError name="consent" message={errors.consent} />
        <button type="submit" className="button button--primary button--wide">
          {pending ? "Sending your message…" : "Let’s start a conversation"}
          {pending ? (
            <LoaderCircle className="spinner" size={18} />
          ) : (
            <ArrowUpRight size={18} />
          )}
        </button>
      </fieldset>
      <p
        className={`form-result${result?.ok ? " form-result--success" : ""}`}
        aria-live="polite"
        role="status"
      >
        {result?.message}
      </p>
      <p className="form-reassurance">
        <LockKeyhole size={13} aria-hidden="true" /> Shared with our team, just
        to help you.
      </p>
    </form>
  );
}
