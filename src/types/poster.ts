export interface PosterContent {
  title: string;
  subtitle: string;
  sections: {
    title: string;
    items: string[];
  }[];
  cta: string;
}

export interface PosterDesign {
  layoutType: string;
  heroPlacement: string;
  colorTheme: string;
  cardStyle: string;
  contentDensity: string;
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