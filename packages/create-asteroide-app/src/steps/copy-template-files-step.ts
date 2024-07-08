import fs from 'fs';
import { CreateAppStep } from '../interfaces';
import { StepContext } from '../types';

export class CopyTemplateFilesStep implements CreateAppStep {
  async run(ctx: StepContext, next: () => void): Promise<void> {
    const projectPath = ctx.get<string>('projectPath');
    const templatePath = ctx.get<string>('template');

    fs.cpSync(templatePath, projectPath, { recursive: true });

    next();
  }
}
