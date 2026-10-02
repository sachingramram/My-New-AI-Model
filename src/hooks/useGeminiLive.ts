"use client";
import { parseAvatarCommand } from "@/lib/ai/avatarCommands";
import { int16ToBase64 } from "@/lib/audio/pcm";
import { useCallback, useRef, useState } from "react";
import {
  GoogleGenAI,
  Modality,
} from "@google/genai";

type GeminiLiveStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "CONNECTED"
  | "ERROR";

  type GeminiLiveSession = {
    close: () => void;
  
    sendRealtimeInput: (input: {
      audio?: {
        data: string;
        mimeType: string;
      };
  
      video?: {
        data: string;
        mimeType: string;
      };
    }) => void;
  };

type UseGeminiLiveOptions = {
    onAudio?: (base64Audio: string) => void;
  
    onStateChange?: (
      state: "THINKING" | "SPEAKING" | "IDLE"
    ) => void;
  
    onExpression?: (
      expression:
        | "neutral"
        | "happy"
        | "sad"
        | "surprised"
        | "confused"
        | "thinking"
        | "excited"
        | "concerned"
    ) => void;
  
    onAction?: (
      action:
        | "none"
        | "smile"
        | "laugh"
        | "blink"
        | "wink"
        | "surprised"
        | "sad"
        | "confused"
    ) => void;
  };

export function useGeminiLive(
  options: UseGeminiLiveOptions = {}
) {
    const {
        onAudio,
        onStateChange,
        onExpression,
        onAction,
      } = options;
  const [status, setStatus] =
    useState<GeminiLiveStatus>("DISCONNECTED");

  const sessionRef = useRef<GeminiLiveSession | null>(null);

  const connect = useCallback(async () => {
    try {
      setStatus("CONNECTING");

      const response = await fetch(
        "/api/realtime/session",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(
          data.error ||
            "Failed to get Gemini Live token"
        );
      }

      const ai = new GoogleGenAI({
        apiKey: data.token,
        httpOptions: {
          apiVersion: "v1alpha",
        },
      });

      const session = await ai.live.connect({
        model: "gemini-3.8-live",

        config: {
            responseModalities: [Modality.AUDIO],
          
            systemInstruction: `
          You are a friendly realtime AI avatar.
          
          During every response, naturally choose an emotional expression
          that matches the meaning and tone of your response.
          
          Available emotions:
          neutral, happy, sad, surprised, confused, thinking, excited, concerned
          
          For now, your emotional state should be communicated through the
          avatar expression callback when available.
          
          Do not exaggerate emotions.
          Use neutral when no strong emotion is appropriate.
          `,
          },

        callbacks: {
          onopen: () => {
            console.log("Gemini Live: CONNECTED");
            setStatus("CONNECTED");
          },

          onmessage: (message) => {
            console.log(
              "Gemini Live message:",
              message
            );
          
            const parts =
              message.serverContent?.modelTurn?.parts;
          
            if (parts) {
              for (const part of parts) {
                const audioData =
                  part.inlineData?.data;
          
                  if (audioData) {
                    onStateChange?.("SPEAKING");
                  
                    onExpression?.("happy");
                    onAction?.("smile");
                  
                    onAudio?.(audioData);
                  }
              }
            }
          
            if (message.serverContent?.turnComplete) {
              onStateChange?.("IDLE");
            }
          },

          onerror: (error) => {
            console.error(
              "Gemini Live error:",
              error
            );

            setStatus("ERROR");
          },

          onclose: (event) => {
            console.log(
              "Gemini Live closed:",
              event.reason
            );

            setStatus("DISCONNECTED");
            sessionRef.current = null;
          },
        },
      });

      sessionRef.current = session;
    } catch (error) {
      console.error(
        "Gemini Live connection failed:",
        error
      );

      setStatus("ERROR");
    }
  }, [onAudio]);

  const disconnect = useCallback(() => {
    sessionRef.current?.close();

    sessionRef.current = null;

    setStatus("DISCONNECTED");
  }, []);

  const sendAudio = useCallback(
    (audio: Int16Array) => {
      const session = sessionRef.current;

      if (!session) {
        return;
      }

      session.sendRealtimeInput({
        audio: {
          data: int16ToBase64(audio),
          mimeType: "audio/pcm;rate=16000",
        },
      });
    },
    []
  );
  const sendVideo = useCallback(
    (base64Image: string) => {
      const session = sessionRef.current;
  
      if (!session) {
        return;
      }
  
      session.sendRealtimeInput({
        video: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      });
    },
    []
  );

  return {
    status,
    connect,
    disconnect,
    sendAudio,
    sendVideo,
  };
}