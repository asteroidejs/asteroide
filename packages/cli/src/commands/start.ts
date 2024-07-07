import { Command } from 'commander';
import { makeProdRunner, makeSwcBuilder } from '../factories';
import { printCliVersion } from '../helpers/print-cli-version';

export default new Command('start')
  .description('Start Asteroide app in production mode')
  .action(() => {
    const builder = makeSwcBuilder();
    const runner = makeProdRunner(builder);
    printCliVersion();
    runner.run();
  });
