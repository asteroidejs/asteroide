import { Command } from 'commander';
import { printCliVersion } from '../helpers/print-cli-version';
import { makeSwcBuilder } from '../factories';
import { makeDevRunner } from '../factories/make-dev-runner';

export default new Command('dev')
  .description('Start Asteroide app in development mode')
  .action(async () => {
    const builder = makeSwcBuilder();
    const runner = makeDevRunner(builder);
    printCliVersion();
    await runner.run();
  });
