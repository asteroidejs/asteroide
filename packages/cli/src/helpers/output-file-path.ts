import path from 'path';
import { DIST_FOLDER, SOURCE_FOLDER } from '@asteroidejs/config';

export function outputFilePath(filePath: string) {
  return path.resolve(
    DIST_FOLDER,
    path.relative(SOURCE_FOLDER, filePath.replace(/\.([jt])s?$/, '.js')),
  );
}
