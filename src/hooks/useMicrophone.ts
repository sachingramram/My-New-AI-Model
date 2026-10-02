"use client";

import { useCallback, useEffect, useState } from "react";

type MicrophoneStatus =
  | "OFF"
  | "CONNECTING"
  | "ON"
  | "DENIED"
  | "ERROR";

export function useMicrophone() {
  const [status, setStatus] =
    useState<MicrophoneStatus>("OFF");

  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const enableMicrophone = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("ERROR");
      return;
    }

    try {
      setStatus("CONNECTING");

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      setStream(mediaStream);
      setStatus("ON");
    } catch (error) {
      console.error("Microphone permission error:", error);

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

  const disableMicrophone = useCallback(() => {
    stream?.getTracks().forEach((track) => {
      track.stop();
    });

    setStream(null);
    setStatus("OFF");
  }, [stream]);

  const toggleMicrophone = useCallback(() => {
    if (status === "ON") {
      disableMicrophone();
    } else {
      enableMicrophone();
    }
  }, [status, enableMicrophone, disableMicrophone]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [stream]);

  return {
    status,
    stream,
    enableMicrophone,
    disableMicrophone,
    toggleMicrophone,
  };
}