import fs from 'fs-extra';
// @ts-ignore
import md5 from 'md5-file/promise';
import path from 'path';
import sqlite from 'sqlite';
import { BASE_DIR, RESOURCES_DIR } from '../constants';
import { ProcessedImage } from '../processor/types';
import { CatalogFile } from '../reader/types';

let databasePromise: Promise<sqlite.Database>;

function openDatabase(): Promise<sqlite.Database> {
  return databasePromise || (databasePromise = (async () => {
    await fs.mkdirs(RESOURCES_DIR);
    const db = await sqlite.open(path.join(RESOURCES_DIR, 'images.db'));
    await db.migrate({ migrationsPath: path.join(BASE_DIR, 'migrations') });
    return db;
  })());
}

export async function insertResults(result: ProcessedImage): Promise<ProcessedImage> {
  const db = await openDatabase();
  const { filename } = result.file;
  const basename = path.basename(filename);
  const hash = await md5(filename);
  await db.run('insert into image values (?, ?, ?, ?, ?)', [
    basename, hash, result.labels, result.entities, result.text],
  );
  for (const relation of result.related) {
    await db.run('insert into image_relation values (null, ?, ?)', [basename, relation]);
  }
  return result;
}

export async function fileNotProcessed(file: CatalogFile): Promise<CatalogFile | null> {
  const db = await openDatabase();
  const hash = await md5(file.filename);
  const result = await db.get('select filename from image where hash = ?', [hash]);
  if (result) {
    console.warn(`${path.basename(file.filename)} already cataloged, skipping...`);
  }
  return !result ? file : null;
}

export async function searchMatches(words: string[]): Promise<ProcessedImage[]> {
  const db = await openDatabase();
  const text = words.join(' ');
  const results = await db.all('select * from image where labels match ? or entities match ? or content match ?', [text, text, text]);
  return results.map((result: any) => ({
    labels: result.labels,
    text: result.text,
    entities: result.entities,
    related: [],
    file: {
      filename: result.filename,
      data: null as any,
    },
  }));
}

export async function closeDatabase() {
  if (databasePromise) {
    await (await databasePromise).close();
  }
}
