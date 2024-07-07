import { AsteroideConfig } from './types';
import { DirectoryScanner } from '@asteroidejs/common';
import { CONFIG_FILE_REGEXS } from './constants';
import { defineConfig } from './define-config';

export class AsteroidConfigLoader {
  private config: AsteroideConfig = defineConfig({});
  private readonly scanner = new DirectoryScanner({
    rootDir: process.cwd(),
    searchFor: CONFIG_FILE_REGEXS,
    onFile: this.onFile.bind(this),
  });

  async load(): Promise<void> {
    await this.scanner.scan();
    this.setEnvVariables();
  }

  private async onFile(filePath: string): Promise<void> {
    const config = (await import(filePath).then(
      (module) => module.default,
    )) as AsteroideConfig;

    this.config = defineConfig(config);
  }

  private setEnvVariables(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iterate = (obj: any, path: string[] = []) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object') {
          iterate(value, [...path, key]);
        } else {
          process.env[`ASTEROIDE_${[...path, key].join('_').toUpperCase()}`] =
            String(value);
        }
      });
    };

    iterate(this.config);
  }
}
