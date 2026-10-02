import type { AIResponse } from "./types";

export interface AIProvider {
  generateResponse(input: string): Promise<AIResponse>;
}