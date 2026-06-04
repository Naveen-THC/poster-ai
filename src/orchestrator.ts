import { generatePosterContent }
  from "./ai/contentAgent";

import { generateDesign }
  from "./ai/designDirector";

import { generateAssets }
  from "./ai/assetGenerator";

import { generateHeroImage }
  from "./ai/imageGenerator";

export async function buildPoster(
  topic: string
) {

  console.time("content");


    const content = await generatePosterContent(topic);
    console.timeEnd("content");

    console.time("design");
    console.time("assets");
    const [design, assets] =
      await Promise.all([
        generateDesign(content.title),
        generateAssets(topic),
      ]);
      console.timeEnd("design");
      console.timeEnd("assets");


  console.time("image");
  const heroImage =
    await generateHeroImage(
      assets.heroImagePrompt
    );
    console.timeEnd("image");

  return {
    content,
    design,
    assets,
    heroImage,
  };
}