import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Cervical Screening After Age 30 What to Expect"
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);