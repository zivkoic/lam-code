"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, type MotionValue } from "framer-motion";
import { Icon } from "./Icon";
import type { Node } from "./flowConfig";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

/* Mobile slots: chips stack center-aligned top→bottom (single column).
   Brain image stays as a backdrop at the top of the stage. */
const MOBILE_SLOTS: Record<number, [number, number][]> = {
  4: [
    [50, 40],
    [50, 54],
    [50, 68],
    [50, 82],
  ],
};

/* Chip positions calibrated to the 16:9 brain rotation video.
   Brain occupies roughly: x ∈ [28%, 72%], y ∈ [10%, 78%] with the stem
   meeting pedestal at ~(50%, 70%). Chips arc over the cerebrum dome. */
const SLOT_LAYOUTS: Record<number, [number, number][]> = {
  4: [
    [32, 30], // 0 — upper-left
    [50, 14], // 1 — top crown
    [68, 30], // 2 — upper-right
    [52, 66], // 3 — over the stem
  ],
};

export type BrainStageProps = {
  nodes: Node[];
  activeIndex: number;
  phase: "idle" | "ingest" | "process" | "output" | "settle";
  /** Optional motion values driven by scroll progress. */
  dim?: MotionValue<number>;
  /** Overall scroll progress 0..1 — drives the 10-frame rotation sequence. */
  progress?: MotionValue<number>;
  /** Force the desktop-style 16:9 layout & chip arc even on mobile.
   *  Used by the mobile hero flow which renders the brain as a 16:9
   *  centrepiece inside a vertical stack. */
  compact?: boolean;
};


const IMG_W = 1600;
const IMG_H = 900; // 16:9 to match the brain rotation video

export function BrainStage({
  nodes,
  activeIndex,
  phase,
  dim,
  progress,
  compact = false,
}: BrainStageProps) {
  const isMobileViewport = useIsMobile();
  // When compact=true, render the desktop-style 16:9 brain even on mobile.
  const isMobile = isMobileViewport && !compact;

  /* Video-driven brain rotation. currentTime is bound to scroll progress
     so the rotation scrubs continuously through the hero scroll. */
  const fallbackProgress = useMotionValue(0);
  const progressMV = progress ?? fallbackProgress;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  /* RAF-batched seek: scroll events can fire faster than the video decoder
     can seek. We collect the latest desired time in a ref and write
     currentTime AT MOST once per animation frame. This stops the decoder
     thrashing and is the single biggest contributor to smooth scrub. */
  const pendingTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const scheduleSeek = () => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const vid = videoRef.current;
      const t = pendingTimeRef.current;
      pendingTimeRef.current = null;
      if (!vid || t === null) return;
      const d = vid.duration;
      if (!d || !isFinite(d)) return;
      vid.currentTime = Math.max(0, Math.min(d - 0.02, t * d));
    });
  };

  useMotionValueEvent(progressMV, "change", (v: number) => {
    pendingTimeRef.current = v;
    scheduleSeek();
  });

  // Re-sync once the video reports its duration (initial paint + on reload)
  useEffect(() => {
    if (videoDuration) {
      pendingTimeRef.current = progressMV.get();
      scheduleSeek();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDuration]);

  // Clean up any pending RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);
  const slots = isMobile
    ? MOBILE_SLOTS[nodes.length] ?? MOBILE_SLOTS[6]
    : SLOT_LAYOUTS[nodes.length] ?? SLOT_LAYOUTS[6];

  /* Match SVG viewBox aspect to the outer container so chip overlay
     positions align with the SVG path coordinates. */
  const VB_H = isMobile ? Math.round(IMG_W * 1.55) : IMG_H;

  /* Workflow lightning path through the chip positions, in viewBox coords.
     Desktop bows the line into curves; mobile keeps it dead-straight vertical. */
  const points = slots.map(([x, y]) => [(x / 100) * IMG_W, (y / 100) * VB_H] as const);

  const pathD = useMemo(() => {
    if (points.length < 2) return "";
    const bow = isMobile ? 0 : 0.22;
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      const cx = mx + (y1 - y0) * bow;
      const cy = my - (x1 - x0) * bow;
      d += ` Q ${cx},${cy} ${x1},${y1}`;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, isMobile]);

  const totalSegments = points.length - 1;
  const lineProgress =
    phase === "idle" || activeIndex < 0
      ? 0
      : phase === "output" || phase === "settle"
        ? 1
        : Math.min(1, (activeIndex + 1) / (totalSegments + 1));

  return (
    <div
      className="relative w-full mx-auto"
      style={{
        aspectRatio: isMobile ? "1 / 1.55" : `${IMG_W} / ${IMG_H}`,
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      {/* Scroll-driven brain rotation video. currentTime is bound to the
          scrollProgress motion value via RAF-batched seeks above.
          - bg-white on the wrapper guarantees no black bleed when the
            video letterboxes inside this 16:9 container.
          - brightness/contrast/saturate filter lifts the gray studio bg
            toward white while keeping the red brain glow vivid.
          - will-change + translate3d promotes to a GPU compositor layer. */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-white"
        style={{
          opacity: dim,
          willChange: "opacity, transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster="/brain-poster.jpg"
          disablePictureInPicture
          onLoadedMetadata={(e) =>
            setVideoDuration(e.currentTarget.duration)
          }
          className="w-full h-full select-none pointer-events-none"
          style={{
            objectFit: "contain",
            objectPosition: isMobile ? "center top" : "center",
            opacity: isMobile ? 0.95 : 1,
            filter: "brightness(1.12) contrast(1.32) saturate(1.18)",
            mixBlendMode: "multiply",
            willChange: "transform",
            transform: "translate3d(0,0,0)",
          }}
        >
          {/* Phones get the 558KB / 540p variant; desktops get the
              2.3MB / 720p variant. Browser picks based on media query. */}
          <source
            src="/brain-mobile.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src="/brain.mp4" type="video/mp4" />
        </video>
        {/* Cover the AI-tool watermark baked into the bottom-right of the
            source video — slightly inset to blend with the page bg. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "9%",
            height: "13%",
            background:
              "radial-gradient(ellipse at center, #ffffff 55%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* SVG overlay: lightning path + node anchor lights */}
      <svg
        viewBox={`0 0 ${IMG_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <defs>
          <filter id="glowMd" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="glowLg" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* Faint ghost of the full path (always visible) */}
        <path
          d={pathD}
          stroke="rgba(243,55,54,0.22)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6 12"
        />

        {/* 3-layer bloom for the active lightning trail */}
        <motion.path
          d={pathD}
          stroke="#f33736"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          filter="url(#glowLg)"
          opacity="0.55"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: lineProgress }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={pathD}
          stroke="#ff5a59"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          filter="url(#glowMd)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: lineProgress }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={pathD}
          stroke="#ffffff"
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: lineProgress }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Node anchor lights */}
        {points.map(([x, y], i) => {
          const lit = phase !== "idle" && i <= activeIndex;
          return (
            <g key={i}>
              {lit && (
                <circle
                  cx={x}
                  cy={y}
                  r={36}
                  fill="rgba(255,42,50,0.35)"
                  filter="url(#glowLg)"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={lit ? 11 : 6}
                fill={lit ? "#fff" : "rgba(255,255,255,0.6)"}
                stroke={lit ? "#f33736" : "rgba(243,55,54,0.4)"}
                strokeWidth={lit ? 3 : 1.5}
              />
              {lit && <circle cx={x} cy={y} r={3.5} fill="#fff5f5" />}
            </g>
          );
        })}
      </svg>

      {/* Chip overlays — sequentially reveal as activeIndex reaches each */}
      {nodes.map((n, i) => {
        const [px, py] = slots[i];
        const state =
          phase === "idle" || i > activeIndex
            ? "hidden"
            : i === activeIndex
              ? "active"
              : "done";
        const visible = state !== "hidden";
        return (
          <motion.div
            key={n.id}
            className="absolute"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 5,
            }}
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{
              opacity: visible ? 1 : 0,
              scale: visible ? 1 : 0.7,
              y: visible ? 0 : 10,
            }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 24,
              mass: 0.7,
            }}
          >
            <motion.div
              className={`chip ${state === "active" ? "chip-active glow-pop" : state === "done" ? "chip-done" : ""}`}
              animate={
                state === "active"
                  ? { scale: [1, 1.08, 1] }
                  : { scale: 1 }
              }
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Icon
                name={n.icon}
                size={14}
                className={
                  state === "hidden"
                    ? "text-zinc-400"
                    : "text-[var(--brand)]"
                }
              />
              <span>{n.label}</span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
