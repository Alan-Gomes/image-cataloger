import { CatalogFile } from '../reader/types';

export interface BaseResponse {
  responses: VisionResponse[];
}

export interface VisionResponse {
  landmarkAnnotations: any[];
  logoAnnotations: any[];
  labelAnnotations: Annotation[];
  textAnnotations: Annotation[];
  localizedObjectAnnotations: LocalizedObjectAnnotation[];
  safeSearchAnnotation: null;
  error: null;
  fullTextAnnotation: FullTextAnnotation;
  webDetection: WebDetection;
  productSearchResults: null;
  context: null;
  file: CatalogFile;
}

export interface FullTextAnnotation {
  pages: Page[];
  text: string;
}

export interface Page {
  blocks: Block[];
  property: Property;
  width: number;
  height: number;
  confidence: number;
}

export interface Block {
  paragraphs: Paragraph[];
  property: Property | null;
  boundingBox: Bounding;
  blockType: string;
  confidence: number;
}

export interface Bounding {
  vertices: Vertex[];
  normalizedVertices: Vertex[];
}

export interface Vertex {
  x: number;
  y: number;
}

export interface Paragraph {
  words?: Paragraph[];
  property: Property | null;
  boundingBox: Bounding;
  confidence: number;
  symbols?: Symbol[];
}

export interface Property {
  detectedLanguages: DetectedLanguage[];
  detectedBreak: DetectedBreak | null;
}

export interface DetectedBreak {
  type: Type;
  isPrefix: boolean;
}

export enum Type {
  EOLSureSpace = 'EOL_SURE_SPACE',
  Space = 'SPACE',
}

export interface DetectedLanguage {
  languageCode: string;
  confidence: number;
}

export interface Symbol {
  property: Property | null;
  boundingBox: Bounding;
  text: string;
  confidence: number;
}

export interface Annotation {
  locations: any[];
  properties: any[];
  mid: string;
  locale: string;
  description: string;
  score: number;
  confidence: number;
  topicality: number;
  boundingPoly: Bounding | null;
}

export interface LocalizedObjectAnnotation {
  mid: string;
  languageCode: string;
  name: string;
  score: number;
  boundingPoly: Bounding;
}

export interface WebDetection {
  webEntities: WebEntity[];
  fullMatchingImages: any[];
  partialMatchingImages: Image[];
  pagesWithMatchingImages: PageWithMatchingImage[];
  visuallySimilarImages: Image[];
  bestGuessLabels: BestGuessLabel[];
}

export interface BestGuessLabel {
  label: string;
  languageCode: string;
}

export interface PageWithMatchingImage {
  fullMatchingImages: any[];
  partialMatchingImages: Image[];
  url: string;
  score: number;
  pageTitle: string;
}

export interface Image {
  url: string;
  score: number;
}

export interface WebEntity {
  entityId: string;
  score: number;
  description: string;
}
