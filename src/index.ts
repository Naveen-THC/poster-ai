import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Preventing Antibiotic Misuse at Home"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);