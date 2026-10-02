"use client";

import { useCallback, useEffect, useState } from "react";

type CameraStatus =
  | "OFF"
  | "CONNECTING"
  | "ON"
  | "DENIED"
  | "ERROR";

export function useCamera() {
  const [status, setStatus] = useState<CameraStatus>("OFF");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const enableCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("ERROR");
      return;
    }

    try {
      setStatus("CONNECTING");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStream(mediaStream);
      setStatus("ON");
    } catch (error) {
      console.error("Camera permission error:", error);

      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        setStatus("DENIED");
      } else {
        setStatus("ERROR");
      }
    }
  }, []);

  const disableCamera = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());

    setStream(null);
    setStatus("OFF");
  }, [stream]);

  const toggleCamera = useCallback(() => {
    if (status === "ON") {
      disableCamera();
    } else {
      enableCamera();
    }
  }, [status, enableCamera, disableCamera]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return {
    status,
    stream,
    enableCamera,
    disableCamera,
    toggleCamera,
  };
}