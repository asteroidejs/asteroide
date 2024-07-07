import { Runner } from '../interfaces';
import { AppEnvironments, Logger } from '@asteroidejs/common';
import { ChildProcess, spawn } from 'child_process';
import { FSWatcher, watch } from 'chokidar';
import { EventEmitter } from 'events';
import path from 'path';
import { CONFIG_FILE_NAMES, SOURCE_FOLDER } from '@asteroidejs/config';
import treeKill from 'tree-kill';
import * as process from 'node:process';

export class DevAppRunner implements Runner {
  readonly envFileNames: string[];
  readonly environment: AppEnvironments;
  readonly events: EventEmitter;
  private appProcess?: ChildProcess;
  private readonly logger: Logger;
  private readonly fileWatcher: FSWatcher;

  constructor() {
    this.envFileNames = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '.env.local'),
      path.resolve(process.cwd(), '.env.development'),
      path.resolve(process.cwd(), '.env.local.development'),
    ];

    this.logger = new Logger({
      context: DevAppRunner.name,
    });

    this.environment = AppEnvironments.DEVELOPMENT;
    this.events = new EventEmitter();
    this.fileWatcher = watch(
      [
        path.resolve(SOURCE_FOLDER, '**', '*.ts'),
        ...CONFIG_FILE_NAMES,
        ...this.envFileNames,
      ],
      {
        ignoreInitial: true,
        ignored: [/\*.d.ts/],
      },
    );

    this.fileWatcher.on('change', async () => {
      console.log();
      await this.killApp();
      this.events.emit('run');
    });
  }

  runApp(_appFilePath: string): Promise<void> | void {
    this.appProcess = spawn('node', [_appFilePath], {
      stdio: 'inherit',
      env: process.env,
      cwd: process.cwd(),
      shell: true,
    });
  }

  private async killApp() {
    await new Promise<void>((resolve, reject) => {
      if (!this.appProcess?.pid) return resolve();
      treeKill(this.appProcess.pid, 'SIGTERM', (error) => {
        if (error) return reject(error);
        resolve();
      });
    }).catch((err) => {
      this.logger.error(err.toString());
      process.exit(1);
    });
  }
}
