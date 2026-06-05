import { generatePosterContent }
  from "./ai/contentAgent";

import { generateAssets }
  from "./ai/assetGenerator";

import { generatePosterImage }
  from "./ai/imageGenerator";

export async function buildPoster(
  topic: string
) {
  console.time("content");

  const content =
    await generatePosterContent(topic);

  console.timeEnd("content");

  console.time("assets");

  const assets =
    await generateAssets(topic);

  console.timeEnd("assets");

  const spec = {
    content,
    assets,
  };

  console.time("poster");

  const draftPoster =
    await generatePosterImage(spec);

  console.timeEnd("poster");

}