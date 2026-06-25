"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./Icon";
import { BrandIcon, type BrandIconName } from "./BrandIcon";
import type { IndustryConfig, IndustryKey } from "./flowConfig";

type Props = {
  industry: IndustryKey;
  config: IndustryConfig;
  phase: "idle" | "ingest" | "process" | "output" | "settle";
  /* Kept for back-compat — scroll-driven flow no longer uses it. */
  onSelectIndustry?: (k: IndustryKey) => void;
};

const groupIcon: Record<IndustryKey, string> = {
  banking: "bank",
  legal: "scale",
  security: "shield",
};

export function InputRail({ industry, config, phase }: Props) {
  return (
    <div className="flex flex-col justify-center gap-2 w-full h-full">
      {/* Only the active industry section is rendered. Cross-fade between
         industries via AnimatePresence + key={industry}. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={industry}
          initial={{ opacity: 0, x: -22, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -22, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl p-2 border border-[rgba(243,55,54,0.5)] bg-white shadow-[0_8px_20px_-12px_rgba(243,55,54,0.4)]"
        >
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--brand)] text-white">
              <Icon name={groupIcon[industry]} size={16} />
            </span>
            <span className="text-[12.5px] tracking-[0.14em] font-bold uppercase text-[var(--brand)]">
              {industry}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {config.inputs.map((doc, idx) => {
              const lit = phase !== "idle";
              return (
                <motion.div
                  key={doc.id}
                  className="rounded-lg bg-white border border-zinc-200 px-2.5 py-2 flex items-center gap-2 min-w-0"
                  initial={{ opacity: 0, x: -14 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    boxShadow: lit
                      ? "0 0 0 1px rgba(243,55,54,0.18), 0 6px 16px -10px rgba(243,55,54,0.45)"
                      : "0 1px 2px rgba(16,24,40,0.04)",
                  }}
                  transition={{
                    delay: 0.12 + idx * 0.05,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <BrandIcon
                    name={doc.icon as BrandIconName}
                    size={26}
                    className="flex-shrink-0"
                  />
                  <div className="flex flex-col leading-tight min-w-0 flex-1">
                    <span
                      className="text-[12px] font-semibold text-zinc-900 leading-snug"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {doc.label}
                    </span>
                    {doc.sub && (
                      <span className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {doc.sub}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
