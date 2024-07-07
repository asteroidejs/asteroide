import { DirectoryScanner } from '@asteroidejs/common';
import * as path from 'node:path';
import { Builder } from './interfaces';

export class AsteroideAppBuilder {
  private readonly files = Array.from<string>([]);
  private readonly scanner = new DirectoryScanner({
    rootDir: path.resolve(process.cwd(), 'src'),
    searchFor: [/\.ts$/],
    onFile: (filePath: string) => {
      this.files.push(filePath);
    },
  });

  constructor(private readonly builder: Builder) {}

  async build() {
    await this.scanner.scan();
    await this.builder.build(this.files);
  }
}
