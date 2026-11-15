"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  domMax,
  m,
  useReducedMotion,
} from "framer-motion";
import { Icon } from "@/components/ui/icon";
import type { ProductPreview } from "@/types/product";

interface ProductShowcaseProps {
  name: string;
  previews: ReadonlyArray<ProductPreview>;
}

export function ProductShowcase({ name, previews }: ProductShowcaseProps) {
  const [active, setActive] = useState(0);
  const id = useId();
  const reducedMotion = useReducedMotion();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const preview = previews[active];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % previews.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + previews.length) % previews.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = previews.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <LazyMotion features={domMax} strict>
      <LayoutGroup id={id}>
        <div className="product-showcase">
          <div className="showcase-surface">
            <div className="showcase-glow" aria-hidden="true" />
            <div
              className="product-tabs"
              role="tablist"
              aria-label="Explore the product"
            >
              {previews.map((item, index) => (
                <button
                  key={item.id}
                  ref={(node) => {
                    refs.current[index] = node;
                  }}
                  role="tab"
                  type="button"
                  id={`${id}-tab-${item.id}`}
                  aria-selected={active === index}
                  aria-controls={`${id}-panel-${item.id}`}
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => navigate(event, index)}
                >
                  {active === index && (
                    <m.span
                      className="product-tabs__selection"
                      layoutId="active-product-tab"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 34 }
                      }
                    />
                  )}
                  <span className="product-tabs__label">
                    <Icon name={item.icon} size={17} />
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            <m.div
              className="showcase-browser"
              initial={false}
              whileHover={reducedMotion ? {} : { y: -3 }}
              transition={{ duration: 0.35 }}
            >
              <div className="showcase-browser__bar">
                <div className="showcase-browser__dots">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="showcase-browser__address">
                  <Icon name="shield" size={12} />
                  {name.toLowerCase().replace(/\s+/g, "")}.workspace
                </span>
                <Icon name="layers" size={15} />
              </div>
              <div className="showcase-images">
                <AnimatePresence initial={false} mode="sync">
                  <m.div
                    key={preview.id}
                    className="showcase-image"
                    role="tabpanel"
                    id={`${id}-panel-${preview.id}`}
                    aria-labelledby={`${id}-tab-${preview.id}`}
                    tabIndex={0}
                    initial={{
                      opacity: reducedMotion ? 1 : 0,
                      y: reducedMotion ? 0 : 16,
                      scale: reducedMotion ? 1 : 0.985,
                    }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.38,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Image
                      src={preview.image}
                      alt={`${preview.label} — illustrative ISP CRM product preview with fictional data`}
                      fill
                      sizes="(max-width: 800px) 90vw, 1100px"
                      priority={active === 0}
                    />
                  </m.div>
                </AnimatePresence>
              </div>
            </m.div>
          </div>
          <div className="showcase-caption">
            <div aria-live="polite">
              <strong>{preview.eyebrow}</strong>
              <p>{preview.description}</p>
            </div>
            <span>
              <span className="showcase-counter">
                0{active + 1}
                <small> / 0{previews.length}</small>
              </span>
              <small>Illustrative previews · Sample data</small>
            </span>
          </div>
        </div>
      </LayoutGroup>
    </LazyMotion>
  );
}
