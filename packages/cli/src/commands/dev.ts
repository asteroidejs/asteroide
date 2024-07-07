import { Command } from 'commander';
import { printCliVersion } from '../helpers/print-cli-version';
import { makeDevRunner, makeSwcBuilder } from '../factories';

export default new Command('dev')
  .description('Start Asteroide app in development mode')
  .action(() => {
    const builder = makeSwcBuilder();
    const runner = makeDevRunner(builder);
    printCliVersion();
    runner.run();
  });
