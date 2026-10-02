"use client";

import { motion } from "framer-motion";

type MouthProps = {
  expression?: string;
  action?: string;
  isSpeaking?: boolean;
};

export default function Mouth({
  expression = "neutral",
  action = "none",
  isSpeaking = false,
}: MouthProps) {
  const isLaughing = action === "laugh";
  const isSmiling =
    action === "smile" || expression === "happy";
  const isSurprised =
    expression === "surprised" || action === "surprised";
  const isSad =
    expression === "sad" || action === "sad";
  const isConfused =
    expression === "confused" || action === "confused";
  const isExcited = expression === "excited";
  const isThinking = expression === "thinking";
  const isConcerned = expression === "concerned";

  return (
    <div className="mt-7 flex justify-center">
      <motion.div
        animate={
          isSpeaking
            ? {
                scaleY: [1, 1.18, 0.82, 1.12, 1],
                scaleX: [1, 1.03, 0.97, 1.02, 1],
              }
            : {
                scaleY: 1,
                scaleX: 1,
              }
        }
        transition={
          isSpeaking
            ? {
                duration: 0.32,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {
                duration: 0.2,
              }
        }
        className="relative flex items-center justify-center"
      >
        {/* LAUGH */}
        {isLaughing && (
          <div className="relative h-14 w-28 overflow-hidden rounded-[45%] bg-[#542f2b] shadow-inner">
            {/* Teeth */}
            <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-b-xl bg-white/95" />

            {/* Tongue */}
            <div className="absolute bottom-1 left-1/2 h-4 w-12 -translate-x-1/2 rounded-t-full bg-[#d98282]" />
          </div>
        )}

        {/* SURPRISED */}
        {!isLaughing && isSurprised && (
          <div className="relative h-16 w-12 rounded-[50%] bg-[#542f2b] shadow-inner">
            <div className="absolute bottom-2 left-1/2 h-5 w-6 -translate-x-1/2 rounded-full bg-[#d98282]" />
          </div>
        )}

        {/* SAD */}
        {!isLaughing &&
          !isSurprised &&
          isSad && (
            <div className="relative h-8 w-24">
              <div className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-t-full border-t-[6px] border-[#8c5149]" />
            </div>
          )}

        {/* CONFUSED */}
        {!isLaughing &&
          !isSurprised &&
          !isSad &&
          isConfused && (
            <div className="relative h-8 w-20">
              <div className="absolute left-1/2 top-3 h-[5px] w-16 -translate-x-1/2 rotate-[-5deg] rounded-full bg-[#8c5149]" />
            </div>
          )}

        {/* SMILE */}
        {!isLaughing &&
          !isSurprised &&
          !isSad &&
          !isConfused &&
          isSmiling && (
            <div className="relative h-9 w-28">
              {/* Upper lip */}
              <div className="absolute left-1/2 top-1 h-3 w-24 -translate-x-1/2 rounded-b-[50%] border-b-[5px] border-[#a85d59]" />

              {/* Lower lip */}
              <div className="absolute bottom-0 left-1/2 h-4 w-20 -translate-x-1/2 rounded-b-full bg-[#c97873]/80" />
            </div>
          )}

        {/* EXCITED */}
        {!isLaughing &&
          !isSurprised &&
          !isSad &&
          !isConfused &&
          !isSmiling &&
          isExcited && (
            <div className="relative h-12 w-24 overflow-hidden rounded-[45%] bg-[#542f2b] shadow-inner">
              <div className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-b-xl bg-white/95" />

              <div className="absolute bottom-1 left-1/2 h-4 w-10 -translate-x-1/2 rounded-t-full bg-[#d98282]" />
            </div>
          )}

        {/* THINKING */}
        {!isLaughing &&
          !isSurprised &&
          !isSad &&
          !isConfused &&
          !isSmiling &&
          !isExcited &&
          isThinking && (
            <div className="h-[5px] w-16 rounded-full bg-[#8c5149]" />
          )}

        {/* CONCERNED */}
        {!isLaughing &&
          !isSurprised &&
          !isSad &&
          !isConfused &&
          !isSmiling &&
          !isExcited &&
          !isThinking &&
          isConcerned && (
            <div className="relative h-7 w-20">
              <div className="absolute left-1/2 top-3 h-[5px] w-16 -translate-x-1/2 rounded-full bg-[#8c5149]" />
            </div>
          )}

        {/* NEUTRAL */}
        {!isLaughing &&
          !isSurprised &&
          !isSad &&
          !isConfused &&
          !isSmiling &&
          !isExcited &&
          !isThinking &&
          !isConcerned && (
            <div className="relative h-7 w-20">
              {/* Upper lip */}
              <div className="absolute left-1/2 top-2 h-[4px] w-16 -translate-x-1/2 rounded-full bg-[#9b5b54]" />

              {/* Lower lip */}
              <div className="absolute left-1/2 top-4 h-[5px] w-12 -translate-x-1/2 rounded-full bg-[#c97873]/70" />
            </div>
          )}
      </motion.div>
    </div>
  );
}