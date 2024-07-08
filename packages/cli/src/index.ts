#!/usr/bin/env node

/*
 * Asteroid @cli
 * Copyright(c) 2024 Lucas Larangeira
 * https://asteroidejs.com
 * MIT Licensed
 */

import { description, name, version } from '../package.json';
import { Command } from 'commander';
import { commands } from './commands';
import { AsteroidConfigLoader } from '@asteroidejs/config';
import { printCliVersion } from './helpers/print-cli-version';

async function cli() {
  printCliVersion();

  const configLoader = new AsteroidConfigLoader();
  await configLoader.load();

  const program = new Command(name)
    .description(description)
    .version(version)
    .usage('<command> [options]');

  commands.forEach((command) => program.addCommand(command));

  await program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

cli().then();
