import { Runner } from '../interfaces';
import { AppEnvironments } from '@asteroidejs/common';
import { EventEmitter } from 'events';
import path from 'path';
import { spawn } from 'child_process';

export class ProdAppRunner implements Runner {
  readonly envFileNames: string[];
  readonly environment: AppEnvironments;
  readonly events: EventEmitter;

  constructor() {
    this.envFileNames = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '.env.production'),
    ];

    this.environment = AppEnvironments.PRODUCTION;
    this.events = new EventEmitter();
  }

  runApp(_appFilePath: string): Promise<void> | void {
    spawn('node', [_appFilePath], {
      stdio: 'inherit',
      env: process.env,
      cwd: process.cwd(),
      shell: true,
    });
  }
}
