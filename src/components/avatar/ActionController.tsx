"use client";

export type AvatarAction =
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

type ActionControllerProps = {
  onAction?: (action: AvatarAction) => void;
};

const actions: AvatarAction[] = [
  "smile",
  "laugh",
  "blink",
  "wink",
  "whistle",
  "surprised",
  "sad",
  "confused",
  "nod",
  "shakeHead",
  "think",
  "yawn",
];

export default function ActionController({
  onAction,
}: ActionControllerProps) {
  const triggerAction = (action: AvatarAction) => {
    onAction?.(action);
  };

  return (
    <div className="flex max-w-xl flex-wrap justify-center gap-2">
      {actions.map((action) => (
        <button
          key={action}
          type="button"
          onClick={() => triggerAction(action)}
          className="rounded-full bg-white px-3 py-2 text-xs capitalize text-neutral-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-100"
        >
          {action}
        </button>
      ))}
    </div>
  );
}