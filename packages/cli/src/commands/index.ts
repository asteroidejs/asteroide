import { Command } from 'commander';
import build from './build';
import dev from './dev';
import start from './start';

export const commands: Command[] = [build, dev, start];
