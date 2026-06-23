import { buildPoster } from "./orchestrator";

async function main() {
  const result = await buildPoster(
    "Managing Treatment siide effects after Surgery",
  );

  console.log(
    JSON.stringify(result, null, 2)
  );
}

main().catch(console.error);