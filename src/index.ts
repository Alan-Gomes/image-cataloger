#!/usr/bin/env node

import path from 'path';
import { from, of } from 'rxjs';
import { bufferCount, filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import Vorpal from 'vorpal';
import { closeDatabase, fileNotProcessed, insertResults, searchMatches } from './database';
import { printInsertion } from './output';
import { processResponses } from './processor';
import { ProcessedImage } from './processor/types';
import { copyFile, readFiles } from './reader';
import { CatalogFile } from './reader/types';
import { annotateImages } from './vision';

const program = new Vorpal();

program
  .command('catalog <filenames...>', 'Catalog multiple files in the database')
  .action(async ({ filenames }) => {
    const paths = filenames.map((file: string) => path.resolve(process.cwd(), file));

    await of(...paths)
      .pipe(
        mergeMap(readFiles),
        mergeMap(fileNotProcessed),
        filter((file): file is CatalogFile => !!file),
        mergeMap(copyFile),
        bufferCount(16, 16),
        mergeMap(annotateImages),
        flatMap(images => images),
        mergeMap(processResponses),
        filter((file): file is ProcessedImage => !!file),
        mergeMap(insertResults),
        tap(printInsertion),
      )
      .toPromise()
      .catch(console.error)
      .finally(closeDatabase);
  });

program
  .command('search <keywords...>', 'Search images by keywords')
  .option('--open', 'Open results')
  .action(async ({ keywords }) => {
    await from(searchMatches(keywords))
      .pipe(
        flatMap(images => images),
        map(image => image.file.filename),
        tap(console.log),
      )
      .toPromise()
      .catch(console.error);
  });

if (process.argv.length <= 2) {
  program.exec('help').catch(console.error);
} else {
  program.parse(process.argv);
}
