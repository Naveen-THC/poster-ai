import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

import { PosterSpec } from "../types/poster";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPosterPrompt(spec: PosterSpec): string {
  const { content, design, assets } = spec;

  const sections = content.sections
    .map(
      (section, index) => `
SECTION ${index + 1}: ${section.title}

${section.items.map((i) => `• ${i}`).join("\n")}
`
    )
    .join("\n\n");

  return `
You are an award-winning healthcare infographic designer creating a premium social media healthcare awareness poster for hospitals, clinics, and medical specialists.

========================
POSTER CONTENT
========================

TITLE:
${content.title}

SUBTITLE:
${content.subtitle}

CONTENT SECTIONS:

${sections}

CALL TO ACTION:
${content.cta}

========================
DESIGN SYSTEM
========================

LAYOUT TYPE:
${design.layoutType}

HERO PLACEMENT:
${design.heroPlacement}

COLOR THEME:
${design.colorTheme}

CARD STYLE:
${design.cardStyle}

CONTENT DENSITY:
${design.contentDensity}

========================
VISUAL DIRECTION
========================

MAIN VISUAL:

${assets.heroImagePrompt}

BACKGROUND VISUAL:

${assets.backgroundPrompt}

========================
CRITICAL REQUIREMENTS
========================

THIS MUST BE A COMPLETE HEALTHCARE INFOGRAPHIC POSTER.

DO NOT generate a standalone photograph.

DO NOT generate only a hero image.

DO NOT generate a lifestyle photo.

The final output must look like a professionally designed medical awareness campaign created by a hospital marketing agency.

The poster should contain:

• Large headline area
• Supporting subtitle
• Educational content cards
• Icons and infographic elements
• Clear content hierarchy
• Visual callouts
• Strong CTA section
• Premium healthcare branding style
• Clean spacing
• Modern editorial layout


========================
VISUAL STYLE
========================

Professional healthcare marketing.

Medical awareness campaign.

Instagram-ready poster.

Editorial infographic.

Premium typography.

Rounded cards.

Subtle shadows.

Hospital-quality branding.

Clean white space.

High readability.

Modern composition.

Balanced layout.

Beautiful visual hierarchy.

Visually engaging.

Premium healthcare advertisement.

========================
TEXT HANDLING
========================

Do NOT attempt to write every bullet point exactly.

Use the provided content as design guidance.

Represent educational information using:

• Headings
• Visual content blocks
• Infographic cards
• Callout areas
• Simplified readable text

Prioritize layout quality over text quantity.

========================
QUALITY TARGET
========================

The final image should resemble premium healthcare posters created by Apollo Hospitals, Fortis Hospitals, Mayo Clinic, Cleveland Clinic, or top medical marketing agencies.

The poster should feel elegant, modern, trustworthy, educational, and visually beautiful.
`;
}

export async function generatePosterImage(
  spec: PosterSpec
) {
  console.log("\n====================");
  console.log("POSTER SPEC");
  console.log("====================\n");

  console.log(JSON.stringify(spec, null, 2));

  const prompt = buildPosterPrompt(spec);

  console.log("\n====================");
  console.log("FINAL IMAGE PROMPT");
  console.log("====================\n");

  console.log(prompt);

  const image = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  const b64 = image.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error("No image returned from OpenAI");
  }

  fs.writeFileSync(
    "poster.png",
    Buffer.from(b64, "base64")
  );

  console.log("\n✅ Poster saved as poster.png\n");

  return "poster.png";
}