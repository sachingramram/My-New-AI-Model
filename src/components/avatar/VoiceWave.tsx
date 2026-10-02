"use client";

import { motion } from "framer-motion";

type VoiceWaveProps = {
  active: boolean;
};

const bars = [
  { height: 10, x: -42, delay: 0 },
  { height: 18, x: -30, delay: 0.08 },
  { height: 26, x: -18, delay: 0.16 },
  { height: 34, x: -6, delay: 0.24 },
  { height: 24, x: 6, delay: 0.32 },
  { height: 17, x: 18, delay: 0.4 },
  { height: 11, x: 30, delay: 0.48 },
];

export default function VoiceWave({
  active,
}: VoiceWaveProps) {
  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-1/2 top-[62%] z-20 flex -translate-x-1/2 items-center gap-2">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className="w-[3px] rounded-full bg-neutral-900/70"
          style={{
            height: bar.height,
          }}
          animate={{
            scaleY: [0.35, 1, 0.5, 1.15, 0.35],
            opacity: [0.25, 0.85, 0.45, 0.8, 0.25],
            y: [0, -3, 2, -2, 0],
          }}
          transition={{
            duration: 0.65,
            delay: bar.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}