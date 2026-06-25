"use client";
import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  USE_CASES,
  INDUSTRY_LABELS,
  INDUSTRY_KICKERS,
  type Industry,
  type UseCase,
} from "./useCasesData";

const INDUSTRIES: Industry[] = ["banking", "legal", "vsaas", "security"];

const easeOut = [0.22, 1, 0.36, 1] as const;

export function UseCasesSection() {
  const [active, setActive] = useState<Industry>("banking");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const cards = useMemo(
    () => USE_CASES.filter((c) => c.industry === active),
    [active]
  );

  const handleTabClick = (key: Industry) => {
    if (key === active) return;
    setActive(key);
    // Instant scroll reset — no smooth, no Lenis, no perceptible lag.
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
  };

  return (
    <section className="relative w-full bg-white py-16 md:py-24">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="text-center font-extrabold tracking-tight leading-[1.05] text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px]"
        >
          What &lsquo;<span className="text-[var(--brand)]">delivered</span>&rsquo; looks like.
        </motion.h2>

        {/* Industry tabs */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.35, delay: 0.12, ease: easeOut }}
          className="mt-10 md:mt-12 flex items-center justify-center"
        >
          <div className="inline-flex items-center gap-0.5 p-1 rounded-full border border-zinc-200 bg-white shadow-sm">
            {INDUSTRIES.map((key) => {
              const isActive = key === active;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabClick(key)}
                  className={`px-4 sm:px-5 py-2 text-[13px] sm:text-[14px] font-medium rounded-full transition-colors duration-200 ${
                    isActive
                      ? "bg-[var(--brand)] text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {INDUSTRY_LABELS[key]}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Industry-specific kicker — fast cross-fade only */}
        <AnimatePresence mode="wait">
          <motion.p
            key={active + "-kicker"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="mt-5 text-center font-mono text-[11px] tracking-[0.22em] text-zinc-500 uppercase"
          >
            {INDUSTRY_KICKERS[active]}
          </motion.p>
        </AnimatePresence>

        {/* Horizontal scroll row. Cards swap INSTANTLY on tab change — no
            per-card animation. data-lenis-prevent stops the global smooth
            scroll from hijacking horizontal wheel events here. */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
          className="mt-10 md:mt-12 relative"
        >
          <div
            ref={scrollerRef}
            data-lenis-prevent
            className="
              flex gap-4 md:gap-5 overflow-x-auto pb-6
              snap-x snap-mandatory
              -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10
              [scrollbar-width:none] [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {cards.map((card) => (
              <UseCaseCard key={card.id} card={card} />
            ))}
          </div>

          {/* Soft right-edge fade hints there's more to scroll. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-6 right-0 w-12 bg-gradient-to-l from-white to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

function UseCaseCard({ card }: { card: UseCase }) {
  return (
    <article
      className="
        card snap-start flex-shrink-0
        flex flex-col justify-between
        w-[280px] sm:w-[320px] md:w-[calc((100%-3*1.25rem)/4)]
        min-h-[440px] md:min-h-[480px]
        p-5 md:p-6
      "
    >
      <div>
        {/* Role tag */}
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--brand)]">
          {card.roleTag}
        </span>

        {/* Title */}
        <h3 className="mt-3 font-extrabold tracking-tight text-[var(--ink)] leading-[1.18] text-[19px] md:text-[21px]">
          {card.title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-[13.5px] text-zinc-600 leading-relaxed">
          {card.description}
        </p>

        {/* Result block */}
        <div className="mt-5 rounded-lg border border-[rgba(243,55,54,0.18)] bg-[rgba(243,55,54,0.04)] px-4 py-3">
          <div className="font-extrabold tracking-tight text-[var(--brand)] text-[28px] md:text-[32px] leading-none">
            {card.result.value}
          </div>
          <div className="mt-1.5 font-mono text-[10.5px] tracking-wide text-zinc-600 uppercase">
            {card.result.label}
          </div>
        </div>

        {/* Quote (no attribution — see useCasesData.ts) */}
        <blockquote className="mt-5 text-[12.5px] italic leading-relaxed text-zinc-700">
          “{card.quote}”
        </blockquote>
      </div>

      {/* CTA — frames the offer as a build-with-us partnership */}
      <a
        href="#build-with-us"
        className="
          mt-6 inline-flex items-center gap-1.5
          text-[13px] font-semibold text-[var(--brand)]
          hover:text-[#d92e2d] transition-colors
        "
      >
        Build this with our team
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M2 6 L10 6 M6 2 L10 6 L6 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </article>
  );
}
