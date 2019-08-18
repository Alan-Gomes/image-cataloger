import chalk from 'chalk';
import path from 'path';
import prettyjson from 'prettyjson';
import { ProcessedImage } from '../processor/types';

export function printInsertion({ file: { filename }, ...image }: ProcessedImage): void {
  console.log(chalk.green(`Data extracted from ${path.basename(filename)}`));
  console.log(prettyjson.render(image));
}
