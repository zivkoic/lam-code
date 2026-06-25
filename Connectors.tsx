"use client";
import React, { useId, useMemo } from "react";

type Phase = "idle" | "ingest" | "process" | "output" | "settle";

type Props = {
  side: "left" | "right";
  /** Number of lines to render — should match the row count of the rail
   *  the connector visually links to (one line per box row). */
  count: number;
  phase: Phase;
};

/* One line per rail row. Lines start at the column edge of the SVG (the
   side closest to the rail) so they never sit on top of the rail boxes,
   and they fade into the brain mass at the other end via a gradient
   stroke — no hard endpoint, no convergence dot.

   A subtle glow "comet" travels along each line:
   - Input side (left): comet moves rail → brain.
   - Output side (right): comet moves brain → rail (outward).

   Implemented as a long dash + animated stroke-dashoffset so we get the
   travelling-light effect without any rendered circles. */
export function Connectors({ side, count, phase }: Props) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "-");
  const W = 120; // viewBox width
  const H = 600; // viewBox height
  const isLeft = side === "left";

  // Convergence sits INSIDE the brain image. The parent container is sized
  // so x = convX visually lands inside the brain mass.
  const convX = isLeft ? 93 : 27;
  const convY = H * 0.5;

  const lines = useMemo(() => {
    const arr: { d: string; y: number }[] = [];
    // Tight, centred y-spread so endpoints land on the rail card rows
    // (the rail content is justify-centre'd inside its column).
    const yMin = H * 0.34;
    const yMax = H * 0.66;
    const n = Math.max(1, count);
    for (let i = 0; i < n; i++) {
      const y = n === 1 ? (yMin + yMax) / 2 : yMin + ((yMax - yMin) * i) / (n - 1);
      const startX = isLeft ? 0 : W;
      const c1x = isLeft ? W * 0.45 : W * 0.55;
      const c1y = y;
      const c2x = isLeft ? convX - 14 : convX + 14;
      const c2y = convY;
      arr.push({
        d: `M ${startX} ${y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${convX} ${convY}`,
        y,
      });
    }
    return arr;
  }, [count, isLeft, convX, convY]);

  const active =
    (isLeft && phase !== "idle") ||
    (!isLeft &&
      (phase === "process" || phase === "output" || phase === "settle"));

  // Gradient from rail-side (solid) to brain-side (transparent) so lines
  // dissolve into the brain mass at convergence.
  const gradFrom = { x: isLeft ? 0 : W, y: H / 2 };
  const gradTo = { x: convX, y: H / 2 };

  // Comet dash pattern. Short solid burst + long gap = a single pulse of
  // light at any moment along each line.
  const CYCLE = 220; // 20 (solid) + 200 (gap), in path units
  // Direction: left side comet moves forward along path (rail→brain);
  // right side moves backward along path (brain→rail = outward).
  const offsetFrom = isLeft ? "0" : `-${CYCLE}`;
  const offsetTo = isLeft ? `-${CYCLE}` : "0";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full h-full overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient
          id={`line-active-${id}`}
          gradientUnits="userSpaceOnUse"
          x1={gradFrom.x}
          y1={gradFrom.y}
          x2={gradTo.x}
          y2={gradTo.y}
        >
          <stop offset="0%" stopColor="rgba(243,55,54,0.7)" />
          <stop offset="55%" stopColor="rgba(243,55,54,0.5)" />
          <stop offset="100%" stopColor="rgba(243,55,54,0)" />
        </linearGradient>
        <linearGradient
          id={`line-idle-${id}`}
          gradientUnits="userSpaceOnUse"
          x1={gradFrom.x}
          y1={gradFrom.y}
          x2={gradTo.x}
          y2={gradTo.y}
        >
          <stop offset="0%" stopColor="rgba(180,182,190,0.55)" />
          <stop offset="55%" stopColor="rgba(180,182,190,0.35)" />
          <stop offset="100%" stopColor="rgba(180,182,190,0)" />
        </linearGradient>
        <linearGradient
          id={`comet-${id}`}
          gradientUnits="userSpaceOnUse"
          x1={gradFrom.x}
          y1={gradFrom.y}
          x2={gradTo.x}
          y2={gradTo.y}
        >
          <stop offset="0%" stopColor="rgba(255,90,90,0.9)" />
          <stop offset="60%" stopColor="rgba(255,42,50,0.85)" />
          <stop offset="100%" stopColor="rgba(255,42,50,0)" />
        </linearGradient>
      </defs>

      {/* Static dashed base line, stroke fades into the brain */}
      {lines.map((l, i) => (
        <path
          key={`l-${i}`}
          d={l.d}
          fill="none"
          stroke={`url(#${active ? `line-active-${id}` : `line-idle-${id}`})`}
          strokeWidth="1.2"
          strokeDasharray="2 4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Travelling glow comet — no circles, just an animated dash that
          rides the line. Layered halo + bright core. */}
      {active &&
        lines.map((_, i) => {
          const dur = 2.4 + (i % 3) * 0.2;
          const delay = (i * 0.55) % dur;
          return (
            <g key={`comet-${i}`}>
              {/* Halo — wider semi-transparent stroke instead of feGaussianBlur.
                  Renders ~5× cheaper on mobile GPUs while reading the same. */}
              <path
                d={lines[i].d}
                fill="none"
                stroke={`url(#comet-${id})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`20 ${CYCLE - 20}`}
                opacity="0.35"
                vectorEffect="non-scaling-stroke"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from={offsetFrom}
                  to={offsetTo}
                  dur={`${dur}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </path>
              {/* Sharp core */}
              <path
                d={lines[i].d}
                fill="none"
                stroke={`url(#comet-${id})`}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray={`20 ${CYCLE - 20}`}
                vectorEffect="non-scaling-stroke"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from={offsetFrom}
                  to={offsetTo}
                  dur={`${dur}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </path>
            </g>
          );
        })}
    </svg>
  );
}
