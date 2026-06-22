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

const CTA = {
  name: "Dr. Naveen Kumar",
  specialty: "Cardiologist",
  phone: "+91 9876543210",
  email: "doctor@example.com",
  location: "Hyderabad",
};

// Doctor placement
const DOCTOR_WIDTH = 280;
const DOCTOR_LEFT = 70;
const DOCTOR_TOP = 1000;

// CTA placement
const CTA_LEFT = 340;
const CTA_TOP = 1040;


async function applyBottomFade(
  imageBuffer: Buffer
): Promise<Buffer> {
  const {
    data,
    info,
  } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({
      resolveWithObject: true,
    });

  const fadeStart = Math.floor(
    info.height * 0.70
  );

  const fadeEnd = info.height;

  for (
    let y = fadeStart;
    y < fadeEnd;
    y++
  ) {
    const progress =
      (y - fadeStart) /
      (fadeEnd - fadeStart);

    /**
     * Smooth fade curve
     */
    const fadeFactor =
      Math.pow(
        1 - progress,
        2
      );

    for (
      let x = 0;
      x < info.width;
      x++
    ) {
      const alphaIndex =
        (y * info.width + x) * 4 + 3;

      data[alphaIndex] =
        Math.round(
          data[alphaIndex] *
            fadeFactor
        );
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}

/**
 * Generate transparent doctor image once
 */
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

  const buffer =
    Buffer.from(arrayBuffer);

  /**
   * Remove transparent padding
   */
  const trimmedBuffer = await sharp(buffer)
    .trim()
    .png()
    .toBuffer();

  /**
   * Analyze alpha channel
   */
  const {
    data,
    info,
  } = await sharp(trimmedBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({
      resolveWithObject: true,
    });

  const rowWidths: number[] = [];

  for (
    let y = 0;
    y < info.height;
    y++
  ) {
    let count = 0;

    for (
      let x = 0;
      x < info.width;
      x++
    ) {
      const alpha =
        data[
          (y * info.width + x) * 4 + 3
        ];

      if (alpha > 20) {
        count++;
      }
    }

    rowWidths.push(count);
  }

  /**
   * Auto chest detection
   */
  let cropY = Math.round(
    info.height * 0.72
  );

  for (
    let y = Math.round(
      info.height * 0.45
    );
    y < info.height - 5;
    y++
  ) {
    const current =
      rowWidths[y];

    const previous =
      rowWidths[y - 1];

    if (
      previous > 0 &&
      current >
        previous * 1.35
    ) {
      cropY = Math.max(
        y - 25,
        Math.round(
          info.height * 0.55
        )
      );

      break;
    }
  }

  console.log(
    `✂️ Auto crop at Y=${cropY}`
  );

  /**
   * Keep some extra coat
   * below chest before fade
   */
  const finalHeight =
    Math.min(
      cropY + 80,
      info.height
    );

  const chestBuffer = await sharp(
    trimmedBuffer
  )
    .extract({
      left: 0,
      top: 0,
      width: info.width,
      height: finalHeight,
    })
    .png()
    .toBuffer();

  /**
   * Apply bottom fade
   */
  const fadedBuffer =
    await applyBottomFade(
      chestBuffer
    );

  /**
   * Trim after fade
   */
  const finalTrimmed =
    await sharp(fadedBuffer)
      .trim()
      .png()
      .toBuffer();

  const metadata = await sharp(
    finalTrimmed
  ).metadata();

  const width =
    metadata.width ?? 0;

  const height =
    metadata.height ?? 0;

  /**
   * Create square canvas
   */
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

  const squareBuffer = await sharp(
    finalTrimmed
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


/**
 * Determine text color based on
 * average CTA background brightness
 */
async function getTextColor(): Promise<string> {
  const { data } = await sharp(
    POSTER_PATH
  )
    .extract({
      left: 320,
      top: 980,
      width: 850,
      height: 240,
    })
    .resize(1, 1)
    .raw()
    .toBuffer({
      resolveWithObject: true,
    });

  const r = data[0];
  const g = data[1];
  const b = data[2];

  const brightness =
    (r * 299 +
      g * 587 +
      b * 114) /
    1000;

  return brightness > 150
    ? "#111111"
    : "#FFFFFF";
}

/**
 * Build CTA text SVG
 */
function buildCTA(
  textColor: string
): string {

  const headingColor =
    textColor === "#FFFFFF"
      ? "#FFFFFF"
      : "#0B2545";

  const specialtyColor =
    textColor === "#FFFFFF"
      ? "#D6E4F0"
      : "#4A5D73";

  return `
<svg width="850" height="220">

<style>

.name {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 46px;
  font-weight: 900;
  letter-spacing: 0.8px;
  fill: ${headingColor};
}

.specialty {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 700;
  fill: ${specialtyColor};
}

.contact {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: 500;
  fill: ${textColor};
}

.divider {
  stroke: ${textColor};
  stroke-opacity: 0.20;
  stroke-width: 2;
}

</style>

<!-- MIDDLE COLUMN -->

<text
  x="30"
  y="70"
  class="name">
  ${CTA.name}
</text>

<text
  x="30"
  y="125"
  class="specialty">
  ${CTA.specialty}
</text>



<!-- RIGHT COLUMN -->

<text
  x="510"
  y="65"
  class="contact">
  ${CTA.phone}
</text>

<text
  x="510"
  y="115"
  class="contact">
  ${CTA.email}
</text>

<text
  x="510"
  y="165"
  class="contact">
  ${CTA.location}
</text>

</svg>
`;
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

  const textColor =
    await getTextColor();

  console.log(
    `🎨 CTA Text Color: ${textColor}`
  );

  const ctaBuffer = await sharp(
    Buffer.from(
      buildCTA(textColor)
    )
  )
    .png()
    .toBuffer();

  await sharp(POSTER_PATH)
    .composite([
      {
        input: doctorBuffer,
        left: DOCTOR_LEFT,
        top: DOCTOR_TOP,
      },
      {
        input: ctaBuffer,
        left: CTA_LEFT,
        top: CTA_TOP,
      },
    ])
    .png()
    .toFile(OUTPUT_PATH);

  console.log(
    `✅ Saved: ${OUTPUT_PATH}`
  );
}

// overlayProfile().catch(console.error);