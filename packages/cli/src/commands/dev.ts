import { Command } from 'commander';
import { makeDevRunner, makeSwcBuilder } from '../factories';

export default new Command('dev')
  .description('Start Asteroide default in development mode')
  .action(() => {
    const builder = makeSwcBuilder();
    const runner = makeDevRunner(builder);
    runner.run();
  });
