#!/usr/bin/env node

/*
 * Asteroid @create-asteroide-default
 * Copyright(c) 2024 Lucas Larangeira
 * https://asteroidejs.com
 * MIT Licensed
 */

import { description, name, version } from '../package.json';

import { Command } from 'commander';
import { createAsteroideApp } from './create-asteroide-app';

async function cli() {
  await new Command(name)
    .description(description)
    .version(version)
    .action(async () => await createAsteroideApp())
    .parseAsync(process.argv);
}

cli().then();
