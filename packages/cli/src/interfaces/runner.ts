import { AppEnvironments } from '@asteroidejs/common';

export interface Runner {
  envFileNames: string[];
  environment: AppEnvironments;
  events: NodeJS.EventEmitter;
  runApp(_appFilePath: string): Promise<void> | void;
}
