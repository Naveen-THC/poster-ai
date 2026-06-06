import sharp from "sharp";
import fs from "fs";

const POSTER_PATH = "poster31.png";
const PROFILE_PATH = "profilePic.jpeg";
const OUTPUT_PATH = "final-poster.png";


// Adjust these values after testing
const AVATAR_SIZE = 180;
const AVATAR_LEFT = 110;
const AVATAR_TOP = 1055;

async function createCircularAvatar(
  profilePath: string,
  size: number
): Promise<Buffer> {
  const circleMask = `
    <svg width="${size}" height="${size}">
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="${size / 2}"
        fill="white"
      />
    </svg>
  `;

  return await sharp(profilePath)
    .resize(size, size, {
      fit: "cover",
      position: "centre",
    })
    .composite([
      {
        input: Buffer.from(circleMask),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

async function overlayProfile() {
  if (!fs.existsSync(POSTER_PATH)) {
    throw new Error(`Poster not found: ${POSTER_PATH}`);
  }

  if (!fs.existsSync(PROFILE_PATH)) {
    throw new Error(`Profile image not found: ${PROFILE_PATH}`);
  }

  const avatarBuffer = await createCircularAvatar(
    PROFILE_PATH,
    AVATAR_SIZE
  );

  await sharp(POSTER_PATH)
    .composite([
      {
        input: avatarBuffer,
        left: AVATAR_LEFT,
        top: AVATAR_TOP,
      },
    ])
    .png()
    .toFile(OUTPUT_PATH);

  console.log(`✅ Saved: ${OUTPUT_PATH}`);
}

overlayProfile().catch(console.error);