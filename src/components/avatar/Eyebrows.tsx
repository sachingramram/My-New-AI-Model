type EyebrowsProps = {
  expression?: string;
};

export default function Eyebrows({
  expression = "neutral",
}: EyebrowsProps) {
  const surprised = expression === "surprised";
  const confused = expression === "confused";
  const sad = expression === "sad";
  const thinking = expression === "thinking";
  const excited = expression === "excited";
  const concerned = expression === "concerned";
  const happy = expression === "happy";

  const leftTransform = surprised
    ? "-translate-y-4"
    : confused
      ? "-rotate-8 -translate-y-1"
      : sad
        ? "rotate-6 translate-y-1"
        : thinking
          ? "-rotate-3 -translate-y-1"
          : excited
            ? "-translate-y-3"
            : concerned
              ? "rotate-3 translate-y-1"
              : happy
                ? "-translate-y-1"
                : "";

  const rightTransform = surprised
    ? "-translate-y-4"
    : confused
      ? "rotate-8 -translate-y-1"
      : sad
        ? "-rotate-6 translate-y-1"
        : thinking
          ? "rotate-3 -translate-y-1"
          : excited
            ? "-translate-y-3"
            : concerned
              ? "-rotate-3 translate-y-1"
              : happy
                ? "-translate-y-1"
                : "";

  return (
    <div className="flex items-center justify-center gap-12">
      <div
        className={`h-[7px] w-[50px] rounded-full bg-[#49352d] shadow-sm transition-all duration-300 ${leftTransform}`}
      />

      <div
        className={`h-[7px] w-[50px] rounded-full bg-[#49352d] shadow-sm transition-all duration-300 ${rightTransform}`}
      />
    </div>
  );
}