import { llmClient, DEFAULT_MODEL } from "../config/llm.js";
import { getJdSystemPrompt } from "../schemas/jd.schema.js";

/**
 * Parses raw Job Description text into structured JSON.
 * @param {string} jdText - Job description text
 * @returns {Promise<object>} - Structured JD object
 */
export const parseJD = async (jdText) => {
  if (!jdText || typeof jdText !== "string" || !jdText.trim()) {
    throw new Error("Job description text is required");
  }

  const systemPrompt = getJdSystemPrompt();
  const userPrompt = `extract the JD in JD schema:\n${jdText}`;

  const response = await llmClient.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to receive output from LLM for JD parsing");
  }

  return JSON.parse(content);
};
