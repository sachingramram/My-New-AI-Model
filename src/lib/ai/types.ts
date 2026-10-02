export type AIEmotion =
  | "neutral"
  | "happy"
  | "sad"
  | "surprised"
  | "confused"
  | "thinking"
  | "excited"
  | "concerned";

export type AIAction =
  | "none"
  | "smile"
  | "laugh"
  | "blink"
  | "wink"
  | "whistle"
  | "surprised"
  | "sad"
  | "confused"
  | "nod"
  | "shakeHead"
  | "think"
  | "yawn";

export type AIResponse = {
  text: string;
  emotion: AIEmotion;
  action: AIAction;
};