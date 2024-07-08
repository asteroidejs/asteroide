import fs from 'fs';
import prompts from 'prompts';
import { CreateAppStep } from '../interfaces';
import { StepContext } from '../types';
import picocolors from 'picocolors';

export class MakeProjectRootStep implements CreateAppStep {
  async run(ctx: StepContext, next: () => void): Promise<void> {
    const projectName = ctx.get<string>('projectName');
    const projectPath = ctx.get<string>('projectPath');

    if (!fs.existsSync(projectPath)) return next();

    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `The directory ${picocolors.blue(projectName)} already exists. Do you want to overwrite it?`,
      initial: false,
    });

    if (!overwrite) throw new Error('Directory already exists');

    if (process.cwd() === projectPath)
      throw new Error('Cannot overwrite current working directory');

    fs.rmSync(projectPath, { recursive: true });
    fs.mkdirSync(projectPath);

    next();
  }
}
