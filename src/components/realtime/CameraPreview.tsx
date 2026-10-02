"use client";

type CameraPreviewProps = {
  stream: MediaStream | null;
  enabled: boolean;
};

export default function CameraPreview({
  stream,
  enabled,
}: CameraPreviewProps) {
  if (!enabled || !stream) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-neutral-950 shadow-sm">
      <video
        autoPlay
        playsInline
        muted
        ref={(video) => {
          if (video) {
            video.srcObject = stream;
          }
        }}
        className="h-full w-full object-cover"
      />

      <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
        You
      </div>
    </div>
  );
}