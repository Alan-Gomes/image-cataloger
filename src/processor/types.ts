import { CatalogFile } from '../reader/types';

export interface ProcessedImage {
  labels: string;
  text: string;
  entities: string;
  related: string[];
  file: CatalogFile;
}
