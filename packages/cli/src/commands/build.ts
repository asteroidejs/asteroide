import { Command } from 'commander';
import { makeSwcBuilder } from '../factories';

export default new Command('build')
  .description('Build Asteroide default')
  .action(async () => {
    const builder = makeSwcBuilder();
    await builder.build({
      exitOnError: true,
    });
  });
