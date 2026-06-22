import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Peripheral Artery Disease",
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);