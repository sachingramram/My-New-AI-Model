import type { AIAction, AIEmotion } from "./types";

const emotions: AIEmotion[] = [
  "neutral",
  "happy",
  "sad",
  "surprised",
  "confused",
  "thinking",
  "excited",
  "concerned",
];

const supportedActions: AIAction[] = [
  "none",
  "smile",
  "laugh",
  "blink",
  "wink",
  "surprised",
  "sad",
  "confused",
];

export type AvatarCommand = {
  emotion: AIEmotion;
  action: AIAction;
};

export function parseAvatarCommand(
  command: string
): AvatarCommand | null {
  const match = command.match(
    /\[AVATAR:([a-z]+):([a-z]+)\]/i
  );

  if (!match) {
    return null;
  }

  const emotion = match[1].toLowerCase() as AIEmotion;
  const action = match[2].toLowerCase() as AIAction;

  if (
    !emotions.includes(emotion) ||
    !supportedActions.includes(action)
  ) {
    return null;
  }

  return {
    emotion,
    action,
  };
}