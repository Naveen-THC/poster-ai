import OpenAI from "openai";
import { VisualAssets } from "../types/poster";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAssets(
  topic: string
): Promise<VisualAssets> {
  const response = await client.responses.create({
    model: "gpt-5-nano",

    input: `
Create image prompts.

Topic:
${topic}

Return JSON only.

{
  "heroImagePrompt":"",
  "backgroundPrompt":"",
}
`,
  });

  return JSON.parse(response.output_text);
}