"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type EyesProps = {
  expression?: string;
  action?: string;
};

export default function Eyes({
  expression = "neutral",
  action = "none",
}: EyesProps) {
  const actionBlink = action === "blink";
  const actionWink = action === "wink";

  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeX, setEyeX] = useState(0);

  // Natural blinking
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const delay = 1800 + Math.random() * 2200;

      timeout = setTimeout(() => {
        setIsBlinking(true);

        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 140);
      }, delay);
    };

    scheduleBlink();

    return () => clearTimeout(timeout);
  }, []);

  // Natural eye movement
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const moveEyes = () => {
      const positions = [-5, 0, 5];

      const randomPosition =
        positions[
          Math.floor(Math.random() * positions.length)
        ];

      setEyeX(randomPosition);

      const delay = 1800 + Math.random() * 2500;

      timeout = setTimeout(moveEyes, delay);
    };

    moveEyes();

    return () => clearTimeout(timeout);
  }, []);

  const surprised = expression === "surprised";
  const happy = expression === "happy";
  const thinking = expression === "thinking";
  const excited = expression === "excited";
  const concerned = expression === "concerned";
  const sad = expression === "sad";

  const eyeHeight =
    isBlinking || actionBlink
      ? 5
      : surprised
        ? 62
        : excited
          ? 58
          : happy
            ? 42
            : sad
              ? 48
              : concerned
                ? 52
                : thinking
                  ? 52
                  : 55;

  return (
    <div className="flex items-center justify-center gap-12">
      {/* LEFT EYE */}
      <motion.div
        animate={{
          height: eyeHeight,
          scaleX: happy ? 0.92 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className={`relative w-[46px] overflow-hidden rounded-[50%] bg-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.08)] ${
          actionWink ? "h-[5px]" : ""
        }`}
      >
        {!isBlinking && !actionBlink && (
          <>
            {/* Iris */}
            <motion.div
              animate={{
                x: eyeX,
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-1/2 h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5b4034]"
            >
              {/* Pupil */}
              <div className="absolute left-1/2 top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-950" />

              {/* Eye highlight */}
              <div className="absolute left-[6px] top-[5px] h-[7px] w-[7px] rounded-full bg-white/90" />

              <div className="absolute bottom-[5px] right-[6px] h-[3px] w-[3px] rounded-full bg-white/50" />
            </motion.div>

            {/* Upper eyelid */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-[9px] rounded-t-full bg-[#f4c9a8]/70" />
          </>
        )}
      </motion.div>

      {/* RIGHT EYE */}
      <motion.div
        animate={{
          height: eyeHeight,
          scaleX: happy ? 0.92 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className="relative w-[46px] overflow-hidden rounded-[50%] bg-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.08)]"
      >
        {!isBlinking && !actionBlink && (
          <>
            {/* Iris */}
            <motion.div
              animate={{
                x: eyeX,
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-1/2 h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5b4034]"
            >
              {/* Pupil */}
              <div className="absolute left-1/2 top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-950" />

              {/* Eye highlight */}
              <div className="absolute left-[6px] top-[5px] h-[7px] w-[7px] rounded-full bg-white/90" />

              <div className="absolute bottom-[5px] right-[6px] h-[3px] w-[3px] rounded-full bg-white/50" />
            </motion.div>

            {/* Upper eyelid */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-[9px] rounded-t-full bg-[#f4c9a8]/70" />
          </>
        )}
      </motion.div>
    </div>
  );
}