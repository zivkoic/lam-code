"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Mounts a global Lenis smooth-scroll instance and binds it to GSAP
 * ScrollTrigger so pin/scrub still works perfectly while the browser's
 * native scroll is replaced by Lenis's RAF-driven lerp.
 *
 * Tuned for an editorial, cinematic cadence inspired by the J12 / Borealis
 * scroll feel: slightly longer duration, cubic-out tail for a silkier
 * settle, and a softer wheel multiplier so flicks don't blow past beats.
 *
 * Honours prefers-reduced-motion by bailing out entirely — native scroll
 * takes over and ScrollTrigger updates from the browser's own scroll event.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      // Shorter ramp + softer easing → input feels responsive without losing
      // the cinematic settle. duration:1.2 was adding perceptible lag on
      // trackpad flicks; 0.9 is the sweet spot with a cubic-out tail.
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
