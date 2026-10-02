"use client";

import { useCallback, useEffect, useState } from "react";

type ScreenShareStatus =
  | "OFF"
  | "CONNECTING"
  | "ON"
  | "DENIED"
  | "ERROR";

export function useScreenShare() {
  const [status, setStatus] = useState<ScreenShareStatus>("OFF");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const enableScreenShare = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setStatus("ERROR");
      return;
    }

    try {
      setStatus("CONNECTING");

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      setStream(mediaStream);
      setStatus("ON");

      const videoTrack = mediaStream.getVideoTracks()[0];

      videoTrack.onended = () => {
        setStream(null);
        setStatus("OFF");
      };
    } catch (error) {
      console.error("Screen share error:", error);

      if (
        error instanceof DOMException &&
        (error.name === "NotAllowedError" ||
          error.name === "AbortError")
      ) {
        setStatus("DENIED");
      } else {
        setStatus("ERROR");
      }
    }
  }, []);

  const disableScreenShare = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());

    setStream(null);
    setStatus("OFF");
  }, [stream]);

  const toggleScreenShare = useCallback(() => {
    if (status === "ON") {
      disableScreenShare();
    } else {
      enableScreenShare();
    }
  }, [status, enableScreenShare, disableScreenShare]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return {
    status,
    stream,
    enableScreenShare,
    disableScreenShare,
    toggleScreenShare,
  };
}