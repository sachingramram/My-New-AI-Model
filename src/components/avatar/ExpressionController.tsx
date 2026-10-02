"use client";

import { useState } from "react";

export type Expression =
  | "neutral"
  | "happy"
  | "sad"
  | "surprised"
  | "confused"
  | "thinking"
  | "excited"
  | "concerned";

type ExpressionControllerProps = {
  onExpressionChange?: (expression: Expression) => void;
};

export default function ExpressionController({
  onExpressionChange,
}: ExpressionControllerProps) {
  const [expression, setExpression] =
    useState<Expression>("neutral");

  const changeExpression = (nextExpression: Expression) => {
    setExpression(nextExpression);
    onExpressionChange?.(nextExpression);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {(
        [
          "neutral",
          "happy",
          "sad",
          "surprised",
          "confused",
          "thinking",
          "excited",
          "concerned",
        ] as Expression[]
      ).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => changeExpression(item)}
          className={`rounded-full px-3 py-2 text-xs capitalize transition ${
            expression === item
              ? "bg-neutral-900 text-white"
              : "bg-white text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}