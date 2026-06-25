"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type Phase = "idle" | "ingest" | "process" | "output" | "settle";

export function useFlowAnimation(nodeCount: number) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  const reset = useCallback(() => {
    clear();
    setPhase("idle");
    setActiveIndex(-1);
  }, [clear]);

  const start = useCallback(() => {
    clear();
    setPhase("ingest");
    setActiveIndex(-1);

    const INGEST_MS = 520;
    const STEP_MS = 460;
    const OUTPUT_DELAY = 220;
    const SETTLE_DELAY = 600;

    schedule(() => setPhase("process"), INGEST_MS);

    for (let i = 0; i < nodeCount; i++) {
      schedule(() => setActiveIndex(i), INGEST_MS + i * STEP_MS);
    }

    const processEnd = INGEST_MS + nodeCount * STEP_MS;
    schedule(() => setPhase("output"), processEnd + OUTPUT_DELAY);
    schedule(() => setPhase("settle"), processEnd + OUTPUT_DELAY + SETTLE_DELAY);
  }, [clear, schedule, nodeCount]);

  useEffect(() => () => clear(), [clear]);

  return { phase, activeIndex, start, reset };
}
