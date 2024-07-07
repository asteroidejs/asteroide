import { DirectoryScanner, Logger } from '@asteroidejs/common';
import * as path from 'node:path';
import { Builder } from './interfaces';
import * as process from 'node:process';
import picocolors from 'picocolors';
import moment from 'moment/moment';

export class AsteroideAppBuilder {
  private readonly logger = new Logger({
    context: AsteroideAppBuilder.name,
  });
  private readonly files = Array.from<string>([]);
  private readonly scanner = new DirectoryScanner({
    rootDir: path.resolve(process.cwd(), 'src'),
    searchFor: [/\.ts$/],
    onFile: (filePath: string) => {
      this.files.push(filePath);
    },
  });

  constructor(private readonly builder: Builder) {}

  async build(options?: { exitOnError?: boolean }) {
    this.logger.info('Starting build process...');

    try {
      await this.scanner.scan();
      const compiledFiles = await this.builder.build(this.files);

      for (const compiledFile of compiledFiles) {
        this.logger.debug(
          `✓ ${compiledFile.path} ${picocolors.gray(`[${compiledFile.duration}ms]`)}`,
        );
      }
    } catch (err) {
      this.logger.error(err);
      if (options?.exitOnError) {
        process.exit(1);
      }
    }

    this.logger.info(
      `Built ${this.files.length} file${this.files.length > 1 || this.files.length === 0 ? 's' : ''}`,
    );

    this.files.length = 0;
  }
}
