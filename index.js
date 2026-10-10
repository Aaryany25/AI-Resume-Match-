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


const exprience ={
    role:"string",
    duration:"string",
    responsibilities: "string"

}

const LLMCall = async (input , textFormat) => {
const response = await client.responses.create({
    model: "openai/gpt-oss-20b",

    instructions: "Return the response as structured JSON.",

    input: input,

    text: {
        format: {
            type: "json_schema",
            name: "user_response",
            schema: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    role: {
                        type: "string"
                    },
                    company: {
                        type: "string"
                    },
                    skiils: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    experience: {
                        type: "array",
                        items: exprience
                    }
                },
                required: ["name", "role", "company","skills","experience"],
                additionalProperties: false
            }
        }
    }
});
console.log(response.output_text);
}

const buffer = await readFile("./Aryan Yadav Frontend.pdf");

const parser = new PDFParse({ data: buffer });

try {
    const result = await parser.getText();
LLMCall(result.text);
    // console.log(result.text);
} finally {
    await parser.destroy();
}


