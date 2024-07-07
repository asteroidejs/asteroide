import { Command } from 'commander';
import { printCliVersion } from '../helpers/print-cli-version';
import { makeSwcBuilder } from '../factories';
import { Logger } from '@asteroidejs/common';

export default new Command('build')
  .description('Build Asteroide app')
  .action(async () => {
    const builder = makeSwcBuilder();
    const logger = new Logger();
    printCliVersion();
    await builder.build().catch((err) => {
      logger.error(err);
      process.exit(1);
    });
  });
