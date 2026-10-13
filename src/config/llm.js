import OpenAI from "openai";
import { config } from "./env.js";

export const llmClient = new OpenAI({
  apiKey: config.groqApiKey,
  baseURL: config.groqBaseUrl,
});

export const DEFAULT_MODEL = config.defaultModel;
