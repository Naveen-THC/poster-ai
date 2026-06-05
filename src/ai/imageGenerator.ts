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
• Modify phone numbers
• Modify email addresses
• Modify doctor names
• Modify locations

Preserve all text exactly.

[POSTER CONTENT]
TITLE: ${content.title}
SUBTITLE: ${content.subtitle}
CONTENT SECTIONS:${sections}
CALL TO ACTION: [
${content.cta}
${content.cta.name}
${content.cta.phone}
${content.cta.email}
${content.cta.location}
]

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
CTA AREA: 20%
IMAGE ASPECT RATIO: Square (1:1)

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