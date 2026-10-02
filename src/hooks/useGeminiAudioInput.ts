"use client";

import { useCallback, useRef, useState } from "react";
import { float32ToInt16 } from "@/lib/audio/pcm";

type SendAudio = (audio: Int16Array) => void;

type UseGeminiAudioInputOptions = {
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
};

export function useGeminiAudioInput(
  sendAudio: SendAudio,
  options: UseGeminiAudioInputOptions = {}
) {
  const {
    onVoiceStart,
    onVoiceEnd,
  } = options;

  const [isCapturing, setIsCapturing] =
    useState(false);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const sourceRef =
    useRef<MediaStreamAudioSourceNode | null>(null);

  const processorRef =
    useRef<ScriptProcessorNode | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const isSpeakingRef =
    useRef(false);

  const silenceTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(async () => {
    if (isCapturing) {
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      const audioContext =
        new AudioContext({
          sampleRate: 16000,
        });

      audioContextRef.current =
        audioContext;

      const source =
        audioContext.createMediaStreamSource(
          stream
        );

      sourceRef.current = source;

      const processor =
        audioContext.createScriptProcessor(
          4096,
          1,
          1
        );

      processorRef.current =
        processor;

      processor.onaudioprocess = (
        event
      ) => {
        const input =
          event.inputBuffer.getChannelData(0);

        // Send audio to Gemini
        const pcm =
          float32ToInt16(input);

        sendAudio(pcm);

        // Calculate microphone volume
        let sum = 0;

        for (let i = 0; i < input.length; i++) {
          sum += input[i] * input[i];
        }

        const rms = Math.sqrt(
          sum / input.length
        );

        // Voice activity threshold
        const isVoiceActive =
          rms > 0.02;

        if (isVoiceActive) {
          if (!isSpeakingRef.current) {
            isSpeakingRef.current = true;

            console.log(
              "User started speaking"
            );

            onVoiceStart?.();
          }

          if (silenceTimerRef.current) {
            clearTimeout(
              silenceTimerRef.current
            );

            silenceTimerRef.current = null;
          }
        } else if (
          isSpeakingRef.current &&
          !silenceTimerRef.current
        ) {
          silenceTimerRef.current =
            setTimeout(() => {
              isSpeakingRef.current =
                false;

              silenceTimerRef.current =
                null;

              console.log(
                "User stopped speaking"
              );

              onVoiceEnd?.();
            }, 700);
        }
      };

      source.connect(processor);

      processor.connect(
        audioContext.destination
      );

      setIsCapturing(true);

      console.log(
        "Gemini microphone capture started"
      );
    } catch (error) {
      console.error(
        "Gemini microphone capture failed:",
        error
      );
    }
  }, [
    isCapturing,
    sendAudio,
    onVoiceStart,
    onVoiceEnd,
  ]);

  const stop = useCallback(() => {
    processorRef.current?.disconnect();

    sourceRef.current?.disconnect();

    if (silenceTimerRef.current) {
      clearTimeout(
        silenceTimerRef.current
      );

      silenceTimerRef.current = null;
    }

    streamRef.current
      ?.getTracks()
      .forEach((track) => {
        track.stop();
      });

    audioContextRef.current?.close();

    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;

    isSpeakingRef.current = false;

    setIsCapturing(false);

    console.log(
      "Gemini microphone capture stopped"
    );
  }, []);

  return {
    isCapturing,
    start,
    stop,
  };
}