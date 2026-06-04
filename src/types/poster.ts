export interface PosterSection {
  title: string;
  items: string[];
}

export interface PosterContent {
  title: string;
  subtitle: string;
  sections: PosterSection[];
  cta: string;
}

export interface DoctorInfo {
  name: string;
  specialty: string;
  clinic: string;
  photoUrl?: string;
}

export interface PosterDesign {
  layoutType:
    | "editorial"
    | "infographic"
    | "magazine"
    | "minimal";

  heroPlacement:
    | "left"
    | "right"
    | "top";

  colorTheme:
    | "clinical-blue"
    | "wellness-green"
    | "purple-care";

  cardStyle:
    | "flat"
    | "elevated"
    | "glass";

  contentDensity:
    | "low"
    | "medium"
    | "high";
}

export interface VisualAssets {
  heroImagePrompt: string;
  backgroundPrompt: string;
  iconPrompts: string[];
}