import OpenAI from "openai";
import { PosterDesign } from "../types/poster";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDesign(
  contentTitle: string
): Promise<PosterDesign> {
  const response = await client.responses.create({
    model: "gpt-5-nano",

    input: `
You are an expert healthcare infographic designer.

Generate JSON only.

{
  "layoutType": "editorial"
  "heroPlacement": "top-center"
  "safeMargin": "10%"
  "contentCoverage": "32"
  "maxSections": 3
  "maxBulletsPerSection": 2
  "headlineArea": "10%"
  "heroArea": "32%"
  "contentArea": "42"
  "ctaArea": "20%"
  "aspectRatio": "1:1"

}

Poster title:
${contentTitle}
`,
  });

  return JSON.parse(response.output_text);
}