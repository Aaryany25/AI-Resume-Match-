import { llmClient, DEFAULT_MODEL } from "../config/llm.js";
import { getResumeSystemPrompt } from "../schemas/resume.schema.js";
import { extractTextFromPdfBuffer } from "./pdf.service.js";

/**
 * Parses raw resume text into structured JSON.
 * @param {string} resumeText - Raw text of candidate resume
 * @returns {Promise<object>} - Structured resume data
 */
export const parseResumeFromText = async (resumeText) => {
  if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
    throw new Error("Resume text is required");
  }

  const systemPrompt = getResumeSystemPrompt();

  const response = await llmClient.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: resumeText,
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to receive output from LLM for resume parsing");
  }

  return JSON.parse(content);
};

/**
 * Extracts text from PDF buffer and parses into structured JSON.
 * @param {Buffer} pdfBuffer - PDF buffer
 * @returns {Promise<{ rawText: string, data: object }>}
 */
export const parseResumeFromPdfBuffer = async (pdfBuffer) => {
  const rawText = await extractTextFromPdfBuffer(pdfBuffer);
  const data = await parseResumeFromText(rawText);
  return { rawText, data };
};
