import { Command } from 'commander';
import { makeProdRunner, makeSwcBuilder } from '../factories';

export default new Command('start')
  .description('Start Asteroide default in production mode')
  .action(() => {
    const builder = makeSwcBuilder();
    const runner = makeProdRunner(builder);
    runner.run();
  });
