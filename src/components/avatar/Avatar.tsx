"use client";
import VoiceWave from "./VoiceWave";
import type { RealtimeState } from "@/types/realtime";
import { motion } from "framer-motion";
import Eyes from "./Eyes";
import Mouth from "./Mouth";
import Eyebrows from "./Eyebrows";
import type { Expression } from "./ExpressionController";
import type { AvatarAction } from "./ActionController";

type AvatarProps = {
  expression: Expression;
  action: AvatarAction;
  realtimeState?: RealtimeState;
};

export default function Avatar({
  expression,
  action,
  realtimeState = "IDLE",
}: AvatarProps) {

  const effectiveExpression =
    realtimeState === "THINKING"
      ? "thinking"
      : realtimeState === "LISTENING"
        ? "neutral"
        : expression;

  return (
    <motion.div
      animate={{
        y: [0, -2, 0, 2, 0],
        rotate: [0, 0.3, 0, -0.3, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative flex aspect-square w-full max-w-[420px] items-center justify-center overflow-hidden rounded-full bg-[#f1eee8] shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
    >
      <div className="relative flex h-[72%] w-[72%] flex-col justify-center rounded-[45%] bg-[#f4c9a8] px-8 shadow-inner">

        {/* Hair */}
        <div className="absolute left-[5%] top-[-13%] h-[30%] w-[90%] rounded-t-[50%] bg-neutral-900" />

        {/* Eyebrows */}
        <div className="mt-6">
          <Eyebrows expression={effectiveExpression} />
        </div>

        {/* Eyes */}
        <div className="mt-7">
          <Eyes
            expression={effectiveExpression}
            action={action}
          />
        </div>

        {/* Nose */}
        {/* Nose */}
<div className="relative mx-auto mt-5 h-11 w-10">
  <div className="absolute left-1/2 top-0 h-9 w-5 -translate-x-1/2 rounded-full bg-[#dfa98a]/70 blur-[1px]" />

  <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2">
    <div className="h-1.5 w-2 rounded-full bg-[#c68f73]/70" />
    <div className="h-1.5 w-2 rounded-full bg-[#c68f73]/70" />
  </div>
</div>
        {/* Mouth */}
        <Mouth
  expression={effectiveExpression}
  action={action}
  isSpeaking={realtimeState === "SPEAKING"}
/>

      </div>
      <VoiceWave active={realtimeState === "SPEAKING"} />
    </motion.div>
  );
}