// @ts-ignore
import removerAcentos from 'remover-acentos';
import { VisionResponse } from '../vision/types';
import { ProcessedImage } from './types';

export async function processResponses(response: VisionResponse): Promise<ProcessedImage> {
  const labels = response.labelAnnotations
    .reduce((acc, label) => `${acc} ${removerAcentos(label.description)}`, '');
  const text = removerAcentos(response.fullTextAnnotation.text.replace(/\n/g, ' ')) as string;
  const entities = response.webDetection.webEntities
    .reduce((acc, entity) => `${acc} ${removerAcentos(entity.description)}`, '');
  const related = [
    ...response.webDetection.partialMatchingImages.map(image => image.url),
    ...response.webDetection.fullMatchingImages.map(image => image.url),
  ];
  return { labels, text, entities, related, file: response.file };
}
