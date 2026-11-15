"use client";

import { useId, useState } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

interface FaqAccordionProps {
  items: ReadonlyArray<{ question: string; answer: string }>;
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="faq-list faq-list--animated">
        {items.map((item, index) => {
          const expanded = open === index;
          return (
            <div
              className={`faq-item${expanded ? " faq-item--open" : ""}`}
              key={item.question}
            >
              <h3>
                <button
                  type="button"
                  id={`${id}-question-${index}`}
                  className="faq-trigger"
                  aria-expanded={expanded}
                  aria-controls={`${id}-answer-${index}`}
                  onClick={() => setOpen(expanded ? null : index)}
                >
                  <span>{item.question}</span>
                  <m.span
                    className="faq-trigger__icon"
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  >
                    <Plus size={17} aria-hidden="true" />
                  </m.span>
                </button>
              </h3>
              <m.div
                initial={false}
                animate={{
                  height: expanded ? "auto" : 0,
                  opacity: expanded ? 1 : 0,
                }}
                transition={{
                  height: {
                    duration: reducedMotion ? 0 : 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  opacity: {
                    duration: reducedMotion ? 0 : 0.25,
                    delay: expanded && !reducedMotion ? 0.08 : 0,
                  },
                }}
                className="faq-answer"
                id={`${id}-answer-${index}`}
                role="region"
                aria-labelledby={`${id}-question-${index}`}
                aria-hidden={!expanded}
                inert={!expanded}
              >
                <div className="faq-answer__inner">
                  <p>{item.answer}</p>
                </div>
              </m.div>
            </div>
          );
        })}
      </div>
    </LazyMotion>
  );
}
