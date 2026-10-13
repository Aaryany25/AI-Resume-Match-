export const EXPERIENCE_SCHEMA = {
  company: "string",
  role: "string",
  duration: "string",
  responsibilities: "string",
};

export const RESUME_SCHEMA = {
  name: "string",
  role: "string",
  company: "string",
  skills: ["string"],
  experience: [EXPERIENCE_SCHEMA],
};

export const getResumeSystemPrompt = (
  resumeSchema = RESUME_SCHEMA,
  experienceSchema = EXPERIENCE_SCHEMA
) => `
Extract the resume details into this JSON structure:

${JSON.stringify(resumeSchema, null, 2)}

Experience schema:
${JSON.stringify(experienceSchema, null, 2)}

Return valid JSON only.
`;
