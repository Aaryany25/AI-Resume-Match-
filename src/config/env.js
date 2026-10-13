import "dotenv/config";

export const config = {
  port: process.env.PORT || 5000,
  groqApiKey: process.env.GROQ_API_KEY,
  groqBaseUrl: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
  defaultModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
};

if (!config.groqApiKey) {
  console.warn(
    "[WARN] GROQ_API_KEY is not defined in environment variables. LLM calls may fail."
  );
}
