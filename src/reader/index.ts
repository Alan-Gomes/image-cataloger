import fs from 'fs-extra';
import path from 'path';
import uuid from 'uuid/v4';
import { RESOURCES_DIR } from '../constants';
import { CatalogFile } from './types';

export async function readFiles(filename: string): Promise<CatalogFile> {
  if (!await fs.pathExists(filename)) {
    throw new Error(`File '${filename}' not found`);
  }
  const data = await fs.readFile(filename);
  return { filename, data };
}

export async function copyFile(file: CatalogFile): Promise<CatalogFile> {
  const imagesDir = path.join(RESOURCES_DIR, 'images');
  await fs.mkdirs(imagesDir);
  const newpath = path.join(imagesDir, uuid() + path.extname(file.filename));
  await fs.writeFile(newpath, file.data);
  return { filename: newpath, data: file.data };
}
