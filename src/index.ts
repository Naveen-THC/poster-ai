import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Preventing Tooth Decay With Fluoride Habits"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);