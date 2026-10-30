"use client";

import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
}

export default function CountUp({
  to,
  from = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  separator = true,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(from);
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  useEffect(() => {
    if (!inView) return;

    const controls = animate(motionVal, to, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Smooth exponential ease-out
      onUpdate: (latest) => {
        if (ref.current) {
          const rounded = Math.round(latest);
          const formatted = separator
            ? rounded.toLocaleString("en-US")
            : rounded.toString();
          ref.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [inView, to, duration, prefix, suffix, separator, motionVal]);

  // Initial SSR / fallback display
  return (
    <span ref={ref} className={className}>
      {prefix}
      {separator ? from.toLocaleString("en-US") : from}
      {suffix}
    </span>
  );
}

