"use client";

import { useCallback, useState } from "react";
import type { RealtimeState } from "@/types/realtime";

export function useRealtimeSession() {
  const [state, setState] =
    useState<RealtimeState>("IDLE");

  const startListening = useCallback(() => {
    setState("LISTENING");
  }, []);

  const startThinking = useCallback(() => {
    setState("THINKING");
  }, []);

  const startSpeaking = useCallback(() => {
    setState("SPEAKING");
  }, []);

  const interrupt = useCallback(() => {
    setState("INTERRUPTED");
  }, []);

  const reset = useCallback(() => {
    setState("IDLE");
  }, []);

  const setError = useCallback(() => {
    setState("ERROR");
  }, []);

  return {
    state,
    startListening,
    startThinking,
    startSpeaking,
    interrupt,
    reset,
    setError,
  };
}