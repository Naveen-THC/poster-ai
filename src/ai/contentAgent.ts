import OpenAI from "openai";
import { PosterContent } from "../types/poster";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePosterContent(
  topic: string
): Promise<PosterContent> {
  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: `
Generate healthcare poster content.

Topic:
${topic}

Return JSON only.

{
  "title":"",
  "subtitle":"",
  "sections":[
    {
      "title":"give 2-3 short section titles",
      "items":[give 2 short bullet points]
    }
  ],
  "cta":
  {
  "name":"Dr. Naveen Chary, MD, FACP",
  "phone":"555-123-4567",
  "email":"naveen.chary@healthcare.com",
  "location":"Taranagar, lingampally, hyderabad"
  }
}
`,
  });

  return JSON.parse(response.output_text);
}