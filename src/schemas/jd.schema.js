export const JD_SCHEMA = {
  role: "string",
  company: "string",
  skills: [],
  responsibilities: [],
  total_experience: null,
};

export const getJdSystemPrompt = (schema = JD_SCHEMA) => `
You are an expert HR assistant.

Your job is to analyze job descriptions and extract structured information from them.

Return ONLY valid JSON matching this schema:

${JSON.stringify(schema, null, 2)}

IMPORTANT:
- Do NOT return the schema itself.
- Do NOT return fields like "properties", "title", or "type".
- Fill the schema with actual information extracted from the job description.
- If minimum experience is not mentioned, return null.
- If information for a list is missing, return an empty list.
- Do not invent information.
`;
