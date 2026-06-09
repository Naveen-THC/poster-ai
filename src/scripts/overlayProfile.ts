import sharp from "sharp";
import fs from "fs";
import { removeBackground } from "@imgly/background-removal-node";

const POSTER_PATH = "poster.png";

const PROFILE_PATH =
  "src/scripts/profile-image.jpg";

const TRANSPARENT_PROFILE_PATH =
  "src/scripts/doctor-transparent.png";

const OUTPUT_PATH =
  "final-poster.png";

// Adjust after testing
const DOCTOR_WIDTH = 260;
const DOCTOR_LEFT = 70;
const DOCTOR_TOP = 1000;

async function getTransparentDoctor(): Promise<string> {
  if (fs.existsSync(TRANSPARENT_PROFILE_PATH)) {
    console.log(
      "✅ Using cached transparent doctor image"
    );

    return TRANSPARENT_PROFILE_PATH;
  }

  console.log(
    "🔄 Creating transparent doctor image..."
  );

  const blob = await removeBackground(
    PROFILE_PATH
  );

  const arrayBuffer =
    await blob.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  /**
   * Trim transparent padding
   */
  const trimmedBuffer = await sharp(buffer)
    .trim()
    .png()
    .toBuffer();

  const metadata = await sharp(
    trimmedBuffer
  ).metadata();

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  const squareSize =
    Math.max(width, height);

  const leftPadding = Math.floor(
    (squareSize - width) / 2
  );

  const rightPadding = Math.ceil(
    (squareSize - width) / 2
  );

  const topPadding = Math.floor(
    (squareSize - height) / 2
  );

  const bottomPadding = Math.ceil(
    (squareSize - height) / 2
  );

  /**
   * Create centered square canvas
   */
  const squareBuffer = await sharp(
    trimmedBuffer
  )
    .extend({
      top: topPadding,
      bottom: bottomPadding,
      left: leftPadding,
      right: rightPadding,
      background: {
        r: 0,
        g: 0,
        b: 0,
        alpha: 0,
      },
    })
    .png()
    .toBuffer();

  fs.writeFileSync(
    TRANSPARENT_PROFILE_PATH,
    squareBuffer
  );

  console.log(
    "✅ Cached:",
    TRANSPARENT_PROFILE_PATH
  );

  return TRANSPARENT_PROFILE_PATH;
}

export async function overlayProfile() {
  if (!fs.existsSync(POSTER_PATH)) {
    throw new Error(
      `Poster not found: ${POSTER_PATH}`
    );
  }

  if (!fs.existsSync(PROFILE_PATH)) {
    throw new Error(
      `Profile image not found: ${PROFILE_PATH}`
    );
  }

  const transparentDoctorPath =
    await getTransparentDoctor();

  const doctorBuffer = await sharp(
    transparentDoctorPath
  )
    .resize({
      width: DOCTOR_WIDTH,
      fit: "contain",
    })
    .png()
    .toBuffer();

  await sharp(POSTER_PATH)
    .composite([
      {
        input: doctorBuffer,
        left: DOCTOR_LEFT,
        top: DOCTOR_TOP,
      },
    ])
    .png()
    .toFile(OUTPUT_PATH);

  console.log(
    `✅ Saved: ${OUTPUT_PATH}`
  );
}

overlayProfile().catch(console.error);