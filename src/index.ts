import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Diabetes Foot Care Preventing Infections"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);