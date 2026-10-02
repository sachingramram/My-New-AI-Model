"use client";

import { useEffect, useRef } from "react";

type SendVideo = (base64Image: string) => void;

export function useGeminiScreenShare(
  stream: MediaStream | null,
  sendVideo: SendVideo,
  enabled: boolean
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!enabled || !stream) {
      return;
    }

    const video = document.createElement("video");

    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.srcObject = stream;

    videoRef.current = video;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      console.error(
        "Screen share: unable to create canvas context"
      );
      return;
    }

    const captureFrame = () => {
      if (
        video.readyState <
        HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        return;
      }

      const width = 1280;
      const height = 720;

      canvas.width = width;
      canvas.height = height;

      context.drawImage(
        video,
        0,
        0,
        width,
        height
      );

      const image =
        canvas.toDataURL(
          "image/jpeg",
          0.7
        );

      const base64Data =
        image.split(",")[1];

      if (!base64Data) {
        return;
      }

      console.log(
        "🖥️ Sending screen frame to Gemini"
      );

      sendVideo(base64Data);
    };

    const startCapture = () => {
      captureFrame();

      const interval =
        window.setInterval(
          captureFrame,
          1000
        );

      cleanupRef.current = interval;
    };

    const cleanupRef = {
      current: null as number | null,
    };

    video.addEventListener(
      "loadeddata",
      startCapture,
      { once: true }
    );

    video.play().catch((error) => {
      console.error(
        "Screen share playback failed:",
        error
      );
    });

    return () => {
      if (cleanupRef.current !== null) {
        window.clearInterval(
          cleanupRef.current
        );
      }

      video.pause();
      video.srcObject = null;
      videoRef.current = null;

      console.log(
        "🖥️ Gemini screen sharing stopped"
      );
    };
  }, [stream, enabled, sendVideo]);
}