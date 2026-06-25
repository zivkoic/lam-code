"use client";
import React from "react";
import { motion } from "framer-motion";
import { BrandIcon, type BrandIconName } from "./BrandIcon";
import type { Tool } from "./flowConfig";

type Phase = "idle" | "ingest" | "process" | "output" | "settle";

type Props = { tools: Tool[]; phase: Phase };

/* Vertical stack of integration app icons (Teams, SharePoint, Power Automate…).
   Sits between the rail and the connector fan-out. */
export function ToolColumn({ tools, phase }: Props) {
  const active = phase !== "idle";
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 h-full">
      {tools.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: active ? [1, 1.06, 1] : 1,
          }}
          transition={{
            opacity: { duration: 0.4, delay: i * 0.06 },
            x: { duration: 0.4, delay: i * 0.06 },
            scale: {
              duration: 1.2,
              delay: i * 0.18,
              repeat: active ? Infinity : 0,
              repeatDelay: 1.4,
            },
          }}
          className="rounded-lg bg-white shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)] ring-1 ring-zinc-200/80"
        >
          <BrandIcon name={t.icon as BrandIconName} size={32} />
        </motion.div>
      ))}
    </div>
  );
}
