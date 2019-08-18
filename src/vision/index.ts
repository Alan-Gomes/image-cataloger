// @ts-ignore
import vision from '@google-cloud/vision';
import path from 'path';
import { BASE_DIR } from '../constants';
import { CatalogFile } from '../reader/types';
import { BaseResponse, VisionResponse } from './types';

const features = ['LOGO_DETECTION', 'LABEL_DETECTION', 'TEXT_DETECTION', 'WEB_DETECTION', 'PRODUCT_SEARCH', 'OBJECT_LOCALIZATION']
  .map(type => ({ type }));

export async function annotateImages(files: CatalogFile[]): Promise<VisionResponse[]> {
  const client = new vision.ImageAnnotatorClient({ keyFilename: path.join(BASE_DIR, 'credentials.json') });

  const requests = await Promise.all(files.map(async file => {
    const content = file.data.toString('base64');
    return {
      image: {
        content,
      },
      features,
    };
  }));

  return (await client.batchAnnotateImages({ requests }) as BaseResponse[])[0].responses
    .map((result, index) => ({ ...result, file: files[index] }));
}
