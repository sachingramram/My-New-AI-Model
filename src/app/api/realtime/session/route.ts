import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const client = new GoogleGenAI({
      apiKey,
    });

    const expireTime = new Date(
      Date.now() + 30 * 60 * 1000
    ).toISOString();

    const newSessionExpireTime = new Date(
      Date.now() + 60 * 1000
    ).toISOString();

    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        newSessionExpireTime,

        liveConnectConstraints: {
          model: "gemini-3.8-live",

          config: {
            responseModalities: [Modality.AUDIO],
          },
        },
      },
    });

    return NextResponse.json({
      token: token.name,
    });
  } catch (error) {
    console.error("Gemini Live token error:", error);

    return NextResponse.json(
      {
        error: "Failed to create Gemini Live session token",
      },
      { status: 500 }
    );
  }
}