import { llmClient, DEFAULT_MODEL } from "../config/llm.js";
import { getMatchSystemPrompt } from "../schemas/match.schema.js";
import { parseJD } from "./jd.service.js";
import { parseResumeFromText, parseResumeFromPdfBuffer } from "./resume.service.js";

/**
 * Matches structured JD data against structured Resume data.
 * @param {object} jdData - Structured JD object
 * @param {object} resumeData - Structured Resume object
 * @returns {Promise<object>} - Evaluation result (score, matchPercentage, skills, etc.)
 */
export const matchStructured = async (jdData, resumeData) => {
  if (!jdData || !resumeData) {
    throw new Error("Both jdData and resumeData are required for matching");
  }

  const systemPrompt = getMatchSystemPrompt();

  const response = await llmClient.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `
JOB DESCRIPTION:
${JSON.stringify(jdData, null, 2)}

CANDIDATE RESUME:
${JSON.stringify(resumeData, null, 2)}
`,
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to receive output from LLM for matching");
  }

  return JSON.parse(content);
};

/**
 * End-to-end matching orchestrator from raw JD text and Resume (Buffer or text).
 * @param {object} params
 * @param {string} params.jdText
 * @param {Buffer} [params.resumeBuffer]
 * @param {string} [params.resumeText]
 * @returns {Promise<{ jd: object, resume: object, match: object }>}
 */
export const matchCandidateAndJob = async ({ jdText, resumeBuffer, resumeText }) => {
  if (!jdText) {
    throw new Error("Job description is required");
  }

  let parsedResume;
  if (resumeBuffer) {
    const parsed = await parseResumeFromPdfBuffer(resumeBuffer);
    parsedResume = parsed.data;
  } else if (resumeText) {
    parsedResume = await parseResumeFromText(resumeText);
  } else {
    throw new Error("Either resumeBuffer (file) or resumeText is required");
  }

  const parsedJd = await parseJD(jdText);
  const matchResult = await matchStructured(parsedJd, parsedResume);

  return {
    jd: parsedJd,
    resume: parsedResume,
    match: matchResult,
  };
};
