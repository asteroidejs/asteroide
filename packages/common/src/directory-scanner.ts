import fs from 'fs';
import path from 'path';
import { ScanOptions } from './types';

export class DirectoryScanner {
  private promises: Promise<void>[] = [];

  constructor(private readonly options: ScanOptions) {}

  async scan() {
    this.promises = [];

    if (!fs.existsSync(this.options.rootDir)) {
      throw new Error(`Directory ${this.options.rootDir} does not exist`);
    }

    await this.scanFiles(this.options.rootDir);
    await Promise.all(this.promises);
  }

  private async scanFiles(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (this.options.ignore?.some((r) => r.test(filePath))) continue;
      if (stat.isDirectory() && !this.options.onlyRootDir) {
        await this.scanFiles(filePath);
      } else {
        const normalizedFilePath = path
          .normalize(filePath)
          .replaceAll(/\\/g, '/');

        if (this.options.searchFor.some((r) => r.test(normalizedFilePath))) {
          await this.options.onFile(normalizedFilePath);
        }
      }
    }
  }
}
