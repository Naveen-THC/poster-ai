import { Stage, Layer } from "react-konva";

import EditorialPoster from "./layouts/EditorialPoster";
import { THEMES } from "./theme";

export default function PosterRenderer({
  content,
  design,
}: any) {

  const theme =
    THEMES[design.colorTheme];

  return (
    <Stage
      width={1024}
      height={1024}
    >
      <Layer>

        {design.layoutType === "editorial" && (
          <EditorialPoster
            content={content}
            theme={theme}
          />
        )}

      </Layer>
    </Stage>
  );
}