import { StepContext } from './types';
import { CreateAppStep } from './interfaces/create-app-step';
import picocolors from 'picocolors';
import * as process from 'node:process';

export class StepRunner {
  ctx: StepContext;

  constructor(private readonly steps: CreateAppStep[]) {
    this.ctx = {
      locals: new Map<string, unknown>(),
      set<T>(key: string, value: T): void {
        this.locals.set(key, value);
      },
      get<T>(key: string): T {
        return this.locals.get(key) as T;
      },
    };
  }

  async run(): Promise<void> {
    await new Promise<void>((resolve) => {
      let i = 0;
      const next = async () => {
        if (i >= this.steps.length) {
          return resolve();
        }
        try {
          await this.steps[i++].run(this.ctx, next);
        } catch (error) {
          console.error(picocolors.red(error.message));
          process.exit(1);
        }
      };

      next();
    });
  }
}
