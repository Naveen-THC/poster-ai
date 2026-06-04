import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateHeroImage(
  prompt: string
) {
  const image = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024"
  });

  const b64 =
    image.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error(
      "No image returned"
    );
  }

  fs.writeFileSync(
    "hero.png",
    Buffer.from(b64, "base64")
  );

  return "hero.png";
}