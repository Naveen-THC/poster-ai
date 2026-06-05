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

  const{
    name,
    phone,
    email,
    location
  } = content.cta;

  const sections = content.sections
    .map(
      (section, index) => `
SECTION ${index + 1}: ${section.title}

${section.items.map((i) => `• ${i}`).join("\n")}
`
    )
    .join("\n\n");

  return `
You are an healthcare infographic designer creating a premium social media healthcare awareness poster for hospitals, clinics, and medical specialists.

[POSTER CONTENT]
TITLE: ${content.title}
SUBTITLE: ${content.subtitle}
CONTENT SECTIONS:${sections}
CALL TO ACTION: ${content.cta}

[DESIGN SYSTEM]
LAYOUT TYPE: ${design.layoutType}
HERO PLACEMENT: ${design.heroPlacement}
MAX SECTIONS: ${design.maxSections}
MAX BULLETS PER SECTION: ${design.maxBulletsPerSection}
SAFE MARGIN: ${design.safeMargin}
CONTENT COVERAGE: ${design.contentCoverage}

[VISUAL DIRECTION]
MAIN VISUAL: ${assets.heroImagePrompt}
BACKGROUND VISUAL: ${assets.backgroundPrompt}

[DOCTOR INFORMATION]

Doctor Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}

Display these details prominently in the footer/contact section.

Include:
• Professional doctor profile card
• Circular doctor photograph
• Doctor name and credentials
• Contact phone number
• Email address
• Clinic location
• Premium healthcare branding

[CRITICAL REQUIREMENTS]
THIS MUST BE A COMPLETE HEALTHCARE INFOGRAPHIC POSTER.
DO NOT generate a standalone photograph.
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

[LAYOUT STRUCTURE]
TOP:
Large headline
Supporting subtitle
Hero visual integrated into design

MIDDLE:
Educational content organized into multiple cards
Infographic blocks
Medical icons
Clear section separation
Easy scanning hierarchy

BOTTOM:
Call to action
Premium footer composition

[VISUAL STYLE]
Professional healthcare marketing.
Medical awareness campaign.
Premium typography.
Subtle shadows.
Hospital-quality branding.
Clean white space.
High readability.
Modern composition.
Balanced layout.
Beautiful visual hierarchy.
Visually engaging.
Premium healthcare advertisement.

[TEXT HANDLING]
Do NOT attempt to write every bullet point exactly.
Use the provided content as design guidance and keep the bullet points short.
Represent educational information using:
• Headings
• Visual content blocks
• Infographic cards
• Callout areas
• Simplified readable text

[QUALITY TARGET]
The final image should resemble premium healthcare posters created by Apollo Hospitals, Fortis Hospitals, Mayo Clinic, Cleveland Clinic, or top medical marketing agencies.
The poster should feel elegant, modern, trustworthy, educational, and visually beautiful.
`;
}

export async function generatePosterImage(
  spec: PosterSpec
) {

  const prompt = buildPosterPrompt(spec);

  const image = await client.images.generate({
    model: "gpt-image-1",
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