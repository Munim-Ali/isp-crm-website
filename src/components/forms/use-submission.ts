"use client";

import { useRef, useState } from "react";
import type { FocusEvent, FormEvent } from "react";
import type { ZodType } from "zod";
import type { FormResponse } from "@/lib/validation";

export function useSubmission(
  endpoint: "/api/contact" | "/api/newsletter",
  schema?: ZodType,
) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<FormResponse | null>(null);
  const busy = useRef(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function valuesFrom(form: HTMLFormElement) {
    const values = Object.fromEntries(new FormData(form));
    return { ...values, consent: values.consent === "on" };
  }

  function validateField(event: FocusEvent<HTMLFormElement>) {
    if (!schema) return;
    const name = event.target.getAttribute("name");
    if (!name || name === "website") return;
    const parsed = schema.safeParse(valuesFrom(event.currentTarget));
    const error = parsed.success
      ? undefined
      : parsed.error.issues.find((issue) => issue.path[0] === name)?.message;
    setFieldErrors((previous) => {
      const next = { ...previous };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    let values: unknown = valuesFrom(form);
    if (schema) {
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const name = String(issue.path[0] ?? "");
          if (name && !errors[name]) errors[name] = issue.message;
        }
        setFieldErrors(errors);
        setResult({
          ok: false,
          message: "Please check the highlighted fields.",
        });
        const first = form.elements.namedItem(Object.keys(errors)[0]);
        if (first instanceof HTMLElement) first.focus();
        return;
      }
      values = parsed.data;
    }
    busy.current = true;
    setPending(true);
    setResult(null);
    setFieldErrors({});
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(25_000),
      });
      const data = (await response.json()) as FormResponse;
      if (typeof data.ok !== "boolean" || typeof data.message !== "string")
        throw new Error("Invalid response");
      setResult({ ok: response.ok && data.ok, message: data.message });
      if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      if (response.ok && data.ok) form.reset();
    } catch {
      setResult({
        ok: false,
        message:
          "We couldn’t connect. Please try again or use our email links.",
      });
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return { pending, result, submit, fieldErrors, validateField };
}
