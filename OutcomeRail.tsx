"use client";
import React from "react";
import { motion } from "framer-motion";
import { Icon } from "./Icon";
import type { IndustryConfig } from "./flowConfig";

type Props = {
  config: IndustryConfig;
  phase: "idle" | "ingest" | "process" | "output" | "settle";
};

const toneRing: Record<string, string> = {
  red: "text-[var(--brand)] bg-red-50",
  green: "text-emerald-600 bg-emerald-50",
  amber: "text-amber-600 bg-amber-50",
  violet: "text-violet-600 bg-violet-50",
  blue: "text-sky-600 bg-sky-50",
};

function CountUp({ value }: { value: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}

export function OutcomeRail({ config, phase }: Props) {
  const reveal = phase === "output" || phase === "settle";
  return (
    <div className="flex flex-col justify-center gap-2 w-full h-full">
      <div className="grid grid-cols-3 gap-2">
        {config.outcomes.map((o, i) => (
          <motion.div
            key={o.id}
            className="rounded-lg bg-white border border-zinc-200 p-2 flex flex-col gap-1.5 min-w-0"
            initial={false}
            animate={{
              opacity: reveal ? 1 : 0.45,
              y: reveal ? 0 : 3,
              boxShadow: reveal
                ? "0 0 0 1px rgba(243,55,54,0.18), 0 8px 22px -14px rgba(243,55,54,0.45)"
                : "0 1px 2px rgba(16,24,40,0.04)",
            }}
            transition={{ duration: 0.45, delay: reveal ? i * 0.05 : 0 }}
          >
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${toneRing[o.tone] ?? toneRing.red}`}
            >
              <Icon name={o.icon} size={16} />
            </span>
            <div className="text-[12px] font-semibold text-zinc-900 leading-snug">
              {o.title}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="rounded-lg bg-white border border-zinc-200 p-2.5 mt-1"
        initial={false}
        animate={{ opacity: phase === "settle" || phase === "output" ? 1 : 0.55 }}
      >
        <div className="text-[12px] font-semibold text-zinc-700 mb-2">
          {config.dashboardTitle}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {config.metrics.map((m, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="text-[10px] text-zinc-500">{m.label}</div>
              <div className="text-[15px] font-bold text-zinc-900">
                <CountUp
                  value={phase === "settle" || phase === "output" ? m.value : "—"}
                />
              </div>
              {m.kind === "bar" && (
                <div className="flex items-end gap-0.5 h-5">
                  {[3, 5, 4, 7, 6, 9, 8].map((h, idx) => (
                    <motion.span
                      key={idx}
                      className="w-1 bg-[var(--brand)] rounded-sm"
                      initial={{ height: 0 }}
                      animate={{ height: phase === "settle" ? `${h * 2.4}px` : 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.4 }}
                    />
                  ))}
                </div>
              )}
              {m.kind === "ring" && (
                <svg viewBox="0 0 36 36" className="w-8 h-8">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#eee" strokeWidth="4" />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 14}
                    initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                    animate={{
                      strokeDashoffset:
                        phase === "settle"
                          ? 2 * Math.PI * 14 * 0.25
                          : 2 * Math.PI * 14,
                    }}
                    transition={{ duration: 0.8 }}
                    transform="rotate(-90 18 18)"
                  />
                </svg>
              )}
              {m.kind === "line" && (
                <svg viewBox="0 0 60 24" className="w-full h-5">
                  <motion.path
                    d="M0 18 L10 14 L20 16 L30 9 L40 11 L50 5 L60 3"
                    stroke="var(--brand)"
                    strokeWidth="1.6"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: phase === "settle" ? 1 : 0 }}
                    transition={{ duration: 0.9 }}
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="rounded-lg bg-white border border-zinc-200 p-2.5 grid grid-cols-3 gap-2"
        initial={false}
        animate={{ opacity: phase === "settle" ? 1 : 0.4 }}
      >
        {config.kpis.map((k, i) => (
          <div key={i} className="flex flex-col">
            <div className="text-[15px] font-extrabold text-[var(--brand)] leading-tight">
              {k.value}
            </div>
            <div className="text-[10px] text-zinc-500 leading-snug mt-0.5">
              {k.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
