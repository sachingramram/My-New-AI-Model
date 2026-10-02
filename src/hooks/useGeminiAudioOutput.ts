"use client";

import { useCallback, useRef } from "react";

function base64ToInt16(base64: string): Int16Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Int16Array(bytes.buffer);
}

export function useGeminiAudioOutput() {
  const audioContextRef =
    useRef<AudioContext | null>(null);

  const nextStartTimeRef =
    useRef(0);

  const activeSourcesRef =
    useRef<AudioBufferSourceNode[]>([]);

  const playAudio = useCallback(
    (base64Audio: string) => {
      if (!audioContextRef.current) {
        audioContextRef.current =
          new AudioContext({
            sampleRate: 24000,
          });
      }

      const audioContext =
        audioContextRef.current;

      const pcm =
        base64ToInt16(base64Audio);

      const audioBuffer =
        audioContext.createBuffer(
          1,
          pcm.length,
          24000
        );

      const channelData =
        audioBuffer.getChannelData(0);

      for (
        let i = 0;
        i < pcm.length;
        i++
      ) {
        channelData[i] =
          pcm[i] / 32768;
      }

      const source =
        audioContext.createBufferSource();

      source.buffer =
        audioBuffer;

      source.connect(
        audioContext.destination
      );

      activeSourcesRef.current.push(
        source
      );

      source.onended = () => {
        activeSourcesRef.current =
          activeSourcesRef.current.filter(
            (activeSource) =>
              activeSource !== source
          );
      };

      const currentTime =
        audioContext.currentTime;

      if (
        nextStartTimeRef.current <
        currentTime
      ) {
        nextStartTimeRef.current =
          currentTime;
      }

      source.start(
        nextStartTimeRef.current
      );

      nextStartTimeRef.current +=
        audioBuffer.duration;
    },
    []
  );

  const stopAudio =
    useCallback(() => {
      for (
        const source of activeSourcesRef.current
      ) {
        try {
          source.stop();
        } catch {
          // Source may already have stopped.
        }
      }

      activeSourcesRef.current = [];

      nextStartTimeRef.current = 0;
    }, []);

  return {
    playAudio,
    stopAudio,
  };
}