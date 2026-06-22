import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

import { PosterSpec } from "../types/poster";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


function buildPosterPrompt(spec: PosterSpec): string {

  const { content, assets } = spec;


  const sections = content.sections
    .map(
      (section, index) => `
SECTION ${index + 1}: ${section.title}

${section.items.map((i) => `• ${i}`).join("\n")}
`
    )
    .join("\n\n");

  return `
You are an elite medical image generator in premium healthcare awareness materials. 

Primary objective:
Create a visually stunning healthcare infographic poster while preserving the provided information accurately.

Balance:
40% information accuracy
60% professional design quality

[TEXT ACCURACY]
Text accuracy is more important than aesthetics.
Use the provided text exactly as supplied.

Do not:
• Rephrase
• Rewrite
• Summarize
• Correct spelling

Preserve all text exactly.

[POSTER CONTENT]
TITLE: ${content.title}
SUBTITLE: ${content.subtitle}
CONTENT SECTIONS:${sections}

[DESIGN SYSTEM]
LAYOUT TYPE: editorial
HERO PLACEMENT: top-center
MAX SECTIONS: 3
MAX BULLETS PER SECTION: 2
SAFE MARGIN: 10%
CONTENT COVERAGE: 32%
HEADLINE AREA: 10%
HERO AREA: 32%
CONTENT AREA: 42%
CTA AREA: 25%
IMAGE ASPECT RATIO: Square (1:1)

[CTA RESERVED AREA]

Reserve the lower 25% of the poster for a post-production CTA section.

Requirements:

• Leave the entire lower area visually clean
• No doctor portraits
• No people
• No text in the left 30% of the CTA area
• No icons in the left 30% of the CTA area
• No important medical illustrations
• Background elements may continue softly into this area

The CTA content and doctor profile will be added later during post-processing.

Design the poster so the CTA section feels naturally integrated with the overall theme.

[VISUAL DIRECTION]
MAIN VISUAL: ${assets.heroImagePrompt}
BACKGROUND VISUAL: ${assets.backgroundPrompt}
`;
}

export async function generatePosterImage(
  spec: PosterSpec
) {

  const prompt = buildPosterPrompt(spec);

  const image = await client.images.generate({
    model: "gpt-image-2",
    prompt,
  });

  const b64 = image.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error("No image returned");
  }

  fs.writeFileSync( 
    "poster.png",
    Buffer.from(b64, "base64")
  );

  console.log("\n Poster saved as poster.png\n");

  return "poster.png";
}