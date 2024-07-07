import { AsteroideAppBuilder } from './asteroide-app-builder';
import { Runner } from './interfaces';
import { DirectoryScanner, Logger } from '@asteroidejs/common';
import { configDotenv } from 'dotenv';
import { DIST_FOLDER } from '@asteroidejs/config';

export class AsteroideAppRunner {
  private readonly scanner: DirectoryScanner;
  private readonly logger: Logger;

  constructor(
    private readonly builder: AsteroideAppBuilder,
    private readonly runner: Runner,
  ) {
    this.scanner = new DirectoryScanner({
      rootDir: DIST_FOLDER,
      searchFor: [/\/_app\.js$/],
      onFile: this.runner.runApp.bind(this.runner),
    });

    this.logger = new Logger({
      context: AsteroideAppRunner.name,
    });
  }

  async run() {
    this.runner.events.on('run', async () => {
      try {
        await this.builder.build();
        this.setupEnv();
        this.resetNodeCache();
        await this.scanner.scan();
      } catch (error) {
        this.logger.error(error.toString());
      }
    });

    this.runner.events.emit('run');
  }

  private setupEnv() {
    configDotenv({
      path: this.runner.envFileNames,
      processEnv: {
        NODE_ENV: this.runner.environment,
      },
    });
  }

  private resetNodeCache() {
    Object.keys(require.cache).forEach((key) => {
      if (!key.includes('node_modules')) {
        delete require.cache[key];
      }
    });
  }
}
