import OpenAI, { toFile }  from "openai";
import dotenv from "dotenv";
import fs from "fs";

const imageFiles = [
    "src/scripts/doctor-transparent.png",
];


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
[CTA LAYOUT]
The doctor information, phone number, email, and location should be arranged to the right of the profile photo placeholder.
Maintain adequate spacing.
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
CTA AREA: 25%
IMAGE ASPECT RATIO: Square (1:1)

[PROFILE PHOTO PLACEHOLDER]
A transparent doctor portrait image is provided.

Requirements: 
• Use the provided portrait. 
• Preserve the face exactly. 
• Do not generate a different person. 
• Position the portrait in the lower-left CTA section. 
• Keep head and shoulders visible. 
• Scale proportionally. 
• Leave sufficient room on the right for: 
- Doctor name 
- Phone 
- Email 
- Location 
• Integrate naturally with the poster design.


[VISUAL DIRECTION]
MAIN VISUAL: ${assets.heroImagePrompt}
BACKGROUND VISUAL: ${assets.backgroundPrompt}
`;
}

export async function generatePosterImage(
  spec: PosterSpec
) {

  const prompt = buildPosterPrompt(spec);

  const images = await Promise.all(
    imageFiles.map(async (file) =>
        await toFile(fs.createReadStream(file), null, {
            type: "image/png",
        })
    ),
);

console.log("Uploading images:", imageFiles);

  const image = await client.images.edit({
    model: "gpt-image-2",
    image: images,
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