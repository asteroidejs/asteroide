import { Command } from 'commander';
import { printCliVersion } from '../helpers/print-cli-version';
import { makeSwcBuilder } from '../factories';

export default new Command('build')
  .description('Build Asteroide app')
  .action(async () => {
    const builder = makeSwcBuilder();
    printCliVersion();
    await builder.build({
      exitOnError: true,
    });
  });
