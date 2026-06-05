import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Recognizing Pregnancy Warning Signs Fast"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);