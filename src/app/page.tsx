"use client";

import { useState } from "react";

import { useGeminiCamera } from "@/hooks/useGeminiCamera";
import { useGeminiAudioOutput } from "@/hooks/useGeminiAudioOutput";
import { useGeminiAudioInput } from "@/hooks/useGeminiAudioInput";
import { useGeminiLive } from "@/hooks/useGeminiLive";
import { useGeminiScreenShare } from "@/hooks/useGeminiScreenShare";

import CameraPreview from "@/components/realtime/CameraPreview";

import { useCamera } from "@/hooks/useCamera";
import { useMicrophone } from "@/hooks/useMicrophone";
import { useRealtimeSession } from "@/hooks/useRealtimeSession";
import { useScreenShare } from "@/hooks/useScreenShare";

import Avatar from "@/components/avatar/Avatar";

import ActionController, {
  type AvatarAction,
} from "@/components/avatar/ActionController";

import ExpressionController, {
  type Expression,
} from "@/components/avatar/ExpressionController";

export default function Home() {
  /* =========================================================
     AUDIO OUTPUT
  ========================================================= */

  const {
    playAudio,
    stopAudio,
  } = useGeminiAudioOutput();

  /* =========================================================
     GEMINI LIVE
  ========================================================= */

  const {
    status: geminiStatus,
    connect: connectGemini,
    disconnect: disconnectGemini,
    sendAudio,
    sendVideo,
  } = useGeminiLive({
    onAudio: playAudio,

    onExpression: (newExpression) => {
      setExpression(newExpression);
    },

    onAction: (newAction) => {
      setAction(newAction);
    },

    onStateChange: (newState) => {
      if (newState === "SPEAKING") {
        startSpeaking();
      }

      if (newState === "IDLE") {
        reset();
      }
    },
  });

  /* =========================================================
     REALTIME AUDIO INPUT
  ========================================================= */

  const {
    isCapturing,
    start: startAudioCapture,
    stop: stopAudioCapture,
  } = useGeminiAudioInput(sendAudio, {
    onVoiceStart: () => {
      interrupt();
      stopAudio();
      startListening();
    },

    onVoiceEnd: () => {
      startThinking();
    },
  });

  /* =========================================================
     SCREEN SHARE
  ========================================================= */

  const {
    status: screenShareStatus,
    stream: screenShareStream,
    toggleScreenShare,
  } = useScreenShare();

  useGeminiScreenShare(
    screenShareStream,
    sendVideo,
    screenShareStatus === "ON"
  );

  /* =========================================================
     CAMERA
  ========================================================= */

  const {
    status: cameraStatus,
    stream: cameraStream,
    toggleCamera,
  } = useCamera();

  useGeminiCamera(
    cameraStream,
    sendVideo,
    cameraStatus === "ON"
  );

  /* =========================================================
     MICROPHONE
  ========================================================= */

  const {
    status: microphoneStatus,
    toggleMicrophone,
  } = useMicrophone();

  /* =========================================================
     AVATAR
  ========================================================= */

  const [expression, setExpression] =
    useState<Expression>("neutral");

  const [action, setAction] =
    useState<AvatarAction>("none");

  /* =========================================================
     REALTIME STATE
  ========================================================= */

  const {
    state,
    startListening,
    startThinking,
    startSpeaking,
    interrupt,
    reset,
  } = useRealtimeSession();

  /* =========================================================
     UI STATE
  ========================================================= */

  const [developerOpen, setDeveloperOpen] =
    useState(false);

  const isConnected =
    geminiStatus === "CONNECTED";

  const isConnecting =
    geminiStatus === "CONNECTING";

  const isSpeaking =
    state === "SPEAKING";

  const isListening =
    state === "LISTENING";

  const isThinking =
    state === "THINKING";

  const statusText =
    state === "SPEAKING"
      ? "Speaking"
      : state === "LISTENING"
        ? "Listening"
        : state === "THINKING"
          ? "Thinking"
          : state === "ERROR"
            ? "Something went wrong"
            : "Ready";

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#f6f6f3] text-neutral-900">

      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-[20%] h-[45vh] w-[45vh] min-h-[280px] min-w-[280px] -translate-x-1/2 rounded-full bg-white blur-3xl transition-all duration-1000 ${
            isSpeaking
              ? "scale-125 opacity-95"
              : isListening
                ? "scale-110 opacity-90"
                : "scale-100 opacity-70"
          }`}
        />

        <div
          className={`absolute bottom-[-15vh] left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full bg-neutral-200/40 blur-3xl transition-all duration-1000 ${
            isThinking
              ? "scale-125 opacity-80"
              : "scale-100 opacity-50"
          }`}
        />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-30 flex h-[64px] shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-sm text-white shadow-sm sm:h-10 sm:w-10">
            ✦
          </div>

          <div>
            <div className="text-sm font-semibold tracking-tight">
              Live AI Avatar
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isConnected
                    ? "bg-emerald-500"
                    : isConnecting
                      ? "animate-pulse bg-yellow-500"
                      : "bg-neutral-300"
                }`}
              />

              <span className="text-[10px] text-neutral-400 sm:text-[11px]">
                {isConnected
                  ? "Gemini connected"
                  : isConnecting
                    ? "Connecting..."
                    : "Not connected"}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/70 text-neutral-500 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white hover:text-neutral-900 sm:h-10 sm:w-10"
        >
          ⚙
        </button>
      </header>

      {/* =====================================================
          MAIN VIEWPORT
      ===================================================== */}

      <section className="relative z-10 flex h-[calc(100dvh-64px)] min-h-0 flex-col px-3 pb-3 sm:px-5 sm:pb-4 lg:px-6">

        {/* =================================================
            TOP STATUS
        ================================================= */}

        <div className="flex shrink-0 justify-center py-2 sm:py-3">
          <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[11px] text-neutral-500 shadow-sm backdrop-blur sm:px-4 sm:py-2 sm:text-xs">
            <span
              className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                state === "ERROR"
                  ? "bg-red-500"
                  : state === "SPEAKING"
                    ? "animate-pulse bg-blue-500"
                    : state === "LISTENING"
                      ? "animate-pulse bg-emerald-500"
                      : state === "THINKING"
                        ? "animate-pulse bg-yellow-500"
                        : "bg-neutral-300"
              }`}
            />

            <span>{statusText}</span>
          </div>
        </div>

        {/* =================================================
            VISUAL AREA
        ================================================= */}

        <div
          className={`relative flex min-h-0 flex-1 gap-3 sm:gap-4 lg:gap-5 ${
            cameraStatus === "ON"
              ? "flex-col md:flex-row"
              : "flex-col"
          }`}
        >

          {/* =================================================
              MOBILE CAMERA — PICTURE IN PICTURE
          ================================================= */}

          {cameraStatus === "ON" && (
            <div
              className="
                pointer-events-none
                absolute
                right-3
                top-3
                z-30
                h-[110px]
                w-[150px]

                sm:right-5
                sm:top-5
                sm:h-[140px]
                sm:w-[190px]

                md:pointer-events-auto
                md:relative
                md:right-auto
                md:top-auto
                md:z-auto
                md:h-auto
                md:w-1/2
                md:flex-1
              "
            >
              <div className="relative h-full w-full rounded-2xl border border-white/90 bg-white/60 p-1.5 shadow-xl backdrop-blur-md sm:rounded-3xl sm:p-2">

                <div className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-950 sm:rounded-2xl">

                  <CameraPreview
                    stream={cameraStream}
                    enabled={true}
                  />

                  {/* Camera label */}
                  <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 text-[9px] text-white backdrop-blur sm:left-3 sm:top-3 sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                    You
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* =================================================
              AVATAR
          ================================================= */}

          <div
            className={`relative min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-white/90 bg-white/45 shadow-sm backdrop-blur sm:rounded-[2rem] ${
              cameraStatus === "ON"
                ? "md:w-1/2"
                : "w-full"
            }`}
          >

            {/* Avatar glow */}
            <div
              className={`absolute left-1/2 top-1/2 h-[min(55vh,520px)] w-[min(55vh,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl transition-all duration-700 ${
                isSpeaking
                  ? "scale-125 opacity-100"
                  : isListening
                    ? "scale-110 opacity-90"
                    : isThinking
                      ? "scale-105 opacity-80"
                      : "scale-100 opacity-65"
              }`}
            />

            {/* Avatar */}
            <div className="relative z-10 flex h-full w-full items-center justify-center p-2 sm:p-4">
              <div className="flex h-full w-full items-center justify-center">
                <div className="w-[min(82vw,520px)] max-w-full">
                  <Avatar
                    expression={expression}
                    action={action}
                    realtimeState={state}
                  />
                </div>
              </div>
            </div>

            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur sm:bottom-5 sm:px-4 sm:py-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />

                <span className="whitespace-nowrap text-[10px] text-neutral-500 sm:text-[11px]">
                  AI is speaking
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            BOTTOM AREA
        ================================================= */}

        <div className="flex shrink-0 flex-col items-center">

          {/* Greeting */}
          <div className="hidden text-center sm:block">
            <h1 className="mt-3 text-xl font-medium tracking-tight lg:text-2xl">
              {isSpeaking
                ? "I'm speaking..."
                : isListening
                  ? "I'm listening..."
                  : isThinking
                    ? "Let me think..."
                    : "How can I help?"}
            </h1>

            <p className="mt-1 text-xs text-neutral-400">
              Talk naturally with your AI avatar
            </p>
          </div>

          {/* Mobile status */}
          <div className="mt-2 text-center sm:hidden">
            <span className="text-sm font-medium">
              {isSpeaking
                ? "Speaking..."
                : isListening
                  ? "Listening..."
                  : isThinking
                    ? "Thinking..."
                    : "How can I help?"}
            </span>
          </div>

          {/* Active media */}
          <div className="mt-2 flex h-5 items-center justify-center gap-1.5">
            {microphoneStatus === "ON" && (
              <span className="rounded-full bg-neutral-950 px-2 py-1 text-[9px] text-white">
                🎤
              </span>
            )}

            {cameraStatus === "ON" && (
              <span className="rounded-full bg-neutral-950 px-2 py-1 text-[9px] text-white">
                📷
              </span>
            )}

            {screenShareStatus === "ON" && (
              <span className="rounded-full bg-neutral-950 px-2 py-1 text-[9px] text-white">
                🖥️
              </span>
            )}
          </div>

          {/* =================================================
              MEDIA CONTROLS
          ================================================= */}

          <div className="mt-2 flex items-center gap-1.5 rounded-full border border-white/90 bg-white/85 p-1.5 shadow-lg shadow-neutral-200/30 backdrop-blur sm:gap-2 sm:p-2">

            {/* Microphone */}
            <button
              type="button"
              onClick={toggleMicrophone}
              aria-label="Toggle microphone"
              title={
                microphoneStatus === "ON"
                  ? "Turn microphone off"
                  : "Turn microphone on"
              }
              className={`flex h-11 w-11 items-center justify-center rounded-full text-lg transition-all duration-200 hover:scale-105 active:scale-95 sm:h-12 sm:w-12 sm:text-xl ${
                microphoneStatus === "ON"
                  ? "bg-neutral-950 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              🎤
            </button>

            {/* Camera */}
            <button
              type="button"
              onClick={toggleCamera}
              aria-label="Toggle camera"
              title={
                cameraStatus === "ON"
                  ? "Turn camera off"
                  : "Turn camera on"
              }
              className={`flex h-11 w-11 items-center justify-center rounded-full text-lg transition-all duration-200 hover:scale-105 active:scale-95 sm:h-12 sm:w-12 sm:text-xl ${
                cameraStatus === "ON"
                  ? "bg-neutral-950 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              📷
            </button>

            {/* Screen share */}
            <button
              type="button"
              onClick={toggleScreenShare}
              aria-label="Toggle screen sharing"
              title={
                screenShareStatus === "ON"
                  ? "Stop screen sharing"
                  : "Share your screen"
              }
              className={`flex h-11 w-11 items-center justify-center rounded-full text-lg transition-all duration-200 hover:scale-105 active:scale-95 sm:h-12 sm:w-12 sm:text-xl ${
                screenShareStatus === "ON"
                  ? "bg-neutral-950 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              🖥️
            </button>
          </div>

          {/* =================================================
              GEMINI CONTROLS
          ================================================= */}

          <div className="mt-2 flex items-center justify-center gap-2">

            {!isConnected ? (
              <button
                type="button"
                onClick={connectGemini}
                disabled={isConnecting}
                className="rounded-full bg-neutral-950 px-4 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {isConnecting
                  ? "Connecting..."
                  : "Connect With Me"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  disconnectGemini();
                  stopAudio();
                  stopAudioCapture();
                }}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[11px] font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Disconnect
              </button>
            )}

            {isConnected && !isCapturing && (
              <button
                type="button"
                onClick={startAudioCapture}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[11px] font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Start conversation
              </button>
            )}

            {isCapturing && (
              <button
                type="button"
                onClick={stopAudioCapture}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[11px] font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                End conversation
              </button>
            )}
          </div>

          {/* Connection status */}
          <div className="mt-1 flex items-center gap-1.5 text-[9px] text-neutral-400 sm:text-[11px]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCapturing
                  ? "animate-pulse bg-emerald-500"
                  : "bg-neutral-300"
              }`}
            />

            {isCapturing
              ? "Live conversation active"
              : isConnected
                ? "successfully connected"
                : "Connect to start"}
          </div>
        </div>
      </section>

      {/* =====================================================
          DEVELOPER BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setDeveloperOpen((previous) => !previous)
        }
        className="fixed bottom-3 right-3 z-50 rounded-full border border-white/80 bg-white/80 px-3 py-2 text-[10px] text-neutral-500 shadow-md backdrop-blur transition hover:bg-white sm:bottom-4 sm:right-5"
      >
        {developerOpen
          ? "Close developer"
          : "Developer"}
      </button>

      {/* =====================================================
          DEVELOPER OVERLAY
      ===================================================== */}

      {developerOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/10 p-3 backdrop-blur-[2px] sm:items-center sm:p-5">

          <div className="max-h-[80dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/80 bg-white/90 p-5 shadow-2xl backdrop-blur-xl">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Developer controls
                </h2>

                <p className="mt-1 text-xs text-neutral-400">
                  Test avatar expressions, actions and realtime states.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeveloperOpen(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              >
                ×
              </button>
            </div>

            {/* Expressions */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Expressions
              </p>

              <ExpressionController
                onExpressionChange={setExpression}
              />
            </div>

            {/* Actions */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Actions
              </p>

              <ActionController
                onAction={setAction}
              />
            </div>

            {/* Realtime state */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Realtime state
              </p>

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs shadow-sm hover:bg-neutral-200"
                >
                  Idle
                </button>

                <button
                  type="button"
                  onClick={startListening}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs shadow-sm hover:bg-neutral-200"
                >
                  Listening
                </button>

                <button
                  type="button"
                  onClick={startThinking}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs shadow-sm hover:bg-neutral-200"
                >
                  Thinking
                </button>

                <button
                  type="button"
                  onClick={startSpeaking}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs shadow-sm hover:bg-neutral-200"
                >
                  Speaking
                </button>

                <button
                  type="button"
                  onClick={interrupt}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs shadow-sm hover:bg-neutral-200"
                >
                  Interrupt
                </button>

              </div>
            </div>

            {/* Debug */}
            <div className="mt-5 grid gap-2 border-t border-neutral-200 pt-4 text-xs text-neutral-400 sm:grid-cols-3">
              <div>
                Microphone: {microphoneStatus}
              </div>

              <div>
                Camera: {cameraStatus}
              </div>

              <div>
                Screen: {screenShareStatus}
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}