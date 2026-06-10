import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Recognizing Cancer Warning Signs Early"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);