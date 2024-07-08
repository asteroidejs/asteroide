import { StepContext } from '../types';

export interface CreateAppStep {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run(ctx: StepContext, next: () => void): Promise<void> | void;
}
