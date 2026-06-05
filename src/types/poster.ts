export interface PosterContent {
  title: string;
  subtitle: string;
  sections: {
    title: string;
    items: string[];
  }[];
  cta: {
    name: string;
    phone: string;
    email: string;
    location: string;
  };
}

export interface PosterDesign {
  layoutType: string;
  heroPlacement: string;
  colorTheme: string;
  cardStyle: string;
  contentDensity: string;
  maxSections: number;
  maxBulletsPerSection: number;
  safeMargin: string;
  contentCoverage: string;
}

export interface VisualAssets {
  heroImagePrompt: string;
  backgroundPrompt: string;
}

export interface PosterSpec {
  content: PosterContent;
  design: PosterDesign;
  assets: VisualAssets;
}