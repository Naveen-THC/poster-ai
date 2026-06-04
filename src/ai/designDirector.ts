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
  "layoutType":"grid-based poster",
  "heroPlacement":"top-center"
  "colorTheme":"",
  "cardStyle":"",
  "contentDensity":""
}

Poster title:
${contentTitle}
`,
  });

  return JSON.parse(response.output_text);
}