import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Preventing Blue Light Overuse At Night"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);