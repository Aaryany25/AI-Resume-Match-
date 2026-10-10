import "dotenv/config";

import OpenAI from "openai";
import { readFile } from "node:fs/promises";
import { PDFParse } from 'pdf-parse';
import { type } from "node:os";

// console.log(process.env.GROQ_API_KEY);
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// Flow 
// Step 1
// Define JD Schema 

const ReadingJD = async () => {
const JDschema = {
    role: "string",
    company: "string",
    skills: [],
    responsibilities: [],
    total_experience: null,
}
// Give JD 
const JD = "Software Development Engineer I (SDE I) at Amazon. Do you want to solve real customer problems through innovative technology? Do you enjoy working on scalable services in a collaborative team environment? Do you want to see your code directly impact millions of customers worldwide? At Amazon, we hire the best minds in technology to innovate and build on behalf of our customers. Customer obsession is part of our company DNA, which has made us one of the world's most beloved brands. Our Software Development Engineers (SDEs) use modern technology to solve complex problems while seeing their work's impact firsthand. The challenges they solve are meaningful and influence millions of customers, sellers, and products globally. We seek individuals passionate about creating new products, features, and services while managing ambiguity in an environment where development cycles are measured in weeks, not years. At Amazon, we believe in ownership at every level. As an SDE I, you'll own the entire lifecycle of your code, from design through deployment and ongoing operations. This ownership mindset, combined with our commitment to operational excellence, ensures we deliver the highest-quality solutions for our customers. We're looking for curious minds who think big and want to define tomorrow's technology. At Amazon, you'll grow into the high-impact engineer you know you can be, supported by a culture of learning and mentorship. Every day brings exciting new challenges and opportunities for personal growth. Key Job Responsibilities: Collaborate and communicate effectively with experienced cross-disciplinary teams to design, build, and operate innovative products and services that delight customers, while participating in technical discussions to drive solutions forward. Design and develop scalable solutions using cloud-native architectures and microservices in a large distributed computing environment. Participate in code reviews and contribute to technical documentation. Build and maintain resilient distributed systems that are scalable, fault-tolerant, and cost-effective. Leverage and contribute to the development of Generative AI (GenAI) and AI-powered tools to enhance development productivity while staying current with emerging technologies. Write clean, maintainable code following best practices and design patterns. Work in an agile environment practicing Continuous Integration and Continuous Delivery (CI/CD) principles while participating in operational responsibilities, including on-call duties. Demonstrate operational excellence through monitoring, troubleshooting, and resolving production issues. Basic Qualifications: Experience with at least one general-purpose programming language, such as Java, Python, C++, C#, Go, Rust, or TypeScript. Experience with data structure implementation, basic algorithm development, and/or object-oriented design principles. Currently has, or is in the process of obtaining, a bachelor's degree in Computer Science, Computer Engineering, Data Science, Information Systems, or a related STEM field. Must be at least 18 years of age. Preferred Qualifications: Experience from previous technical internships or demonstrated project experience. Experience with one or more of the following: AI tools for development productivity, cloud platforms (preferably AWS), database systems (SQL and NoSQL), contributing to open-source projects, version control systems, and debugging and troubleshooting complex systems. Demonstrated ability to learn and adapt to new technologies quickly. Basic understanding of the Software Development Lifecycle (SDLC). Strong problem-solving and analytical skills. Excellent written and verbal communication skills.";
//Make a System prompt
const system_prompt =  `
You are an expert HR assistant.

Your job is to analyze job descriptions and extract
structured information from them.

Return ONLY valid JSON matching this schema:

${JSON.stringify(JDschema, null, 2)}

IMPORTANT:
- Do NOT return the schema itself.
- Do NOT return fields like "properties", "title", or "type".
- Fill the schema with actual information extracted from the job description.
- If minimum experience is not mentioned, return null.
- If information for a list is missing, return an empty list.
- Do not invent information.
`;
// Make a User Prompt
const user_prompt = `
extract the JD in JD schema
${JD}
`
// Make the call with message Sytem and User in
 const messages = [
    {
      "role": "system",
      "content": system_prompt //-->extract the JD in JD schema
    },
    {
      "role": "user",
      "content": user_prompt // -->Analysis the JD
    }
  ]
// Calling the LLM
  const response = await client.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: messages,
  response_format: {
    type: "json_object",
  },
  
});
const answer = response.choices[0].message.content;

const result = JSON.parse(answer);

return result
}
// Step 2
// make exprience Schema
const ParsingResume = async () => {
const ExperienceSchema = {
  company: "string",
    role: "string",
    duration: "string",
    responsibilities: "string"
}
// make Resume schema

const resumeSchema = {
    name: "string",
    role: "string",
    company: "string",
    skills: ["string"],
    experience: [ExperienceSchema]
};
// Make the Result Schema with score and match percentage

  const user_Resume_prompt = `
extract the Resume in Resume schema
Extract the resume details into this JSON structure:

${JSON.stringify(resumeSchema, null, 2)}

Experience schema:
${JSON.stringify(ExperienceSchema, null, 2)}

Return valid JSON only.
`

const buffer = await readFile("./Aryan Yadav Frontend.pdf");

const parser = new PDFParse({ data: buffer });
const  resume = await parser.getText();
const resumetext = resume.text;
  const ResumeResponse = await client.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [
    {
      role: "system",
      content: user_Resume_prompt
    },
    {
      role: "user",
      content: resumetext
    }
  ],
  response_format: {
    type: "json_object",
  },
});
const answers = ResumeResponse.choices[0].message.content;

const resultss = JSON.parse(answers);

return resultss
// console.log(resultss);
}

// Part 3

const JDdata = await ReadingJD();
const ResumeData = await ParsingResume();

const MatchingJDResume = async (JDdata, ResumeData) => {
    const resultSchema = {
    score: "number",
    matchPercentage: "number",
    matchedSkills: ["string"],
    missingSkills: ["string"],
    missingDetails: ["string"],
    finalVerdict: "string"
  };
   const response = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `
You are an expert technical recruiter.

Compare the job description with the candidate's resume.

Return valid JSON only, matching this structure:
${JSON.stringify(resultSchema, null, 2)}

Rules:
- score must be between 0 and 100.
- matchPercentage must be between 0 and 100.
- matchedSkills must contain skills supported by the resume.
- missingSkills must contain relevant JD skills not found in the resume.
- missingDetails must list important missing qualifications.
- Do not invent candidate experience.
- Base the verdict on the actual evidence.
- Treat the score as an estimate, not an objective probability.
`
      },
      {
        role: "user",
        content: `
JOB DESCRIPTION:
${JSON.stringify(JDdata, null, 2)}

CANDIDATE RESUME:
${JSON.stringify(ResumeData, null, 2)}
`
      }
    ],
    response_format: {
      type: "json_object"
    }
  });
   const result = JSON.parse(response.choices[0].message.content);

console.log("Match Result:", result);
};

await MatchingJDResume(JDdata, ResumeData);


