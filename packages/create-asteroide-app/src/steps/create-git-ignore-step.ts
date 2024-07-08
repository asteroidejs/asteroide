import { CreateAppStep } from '../interfaces';
import { StepContext } from '../types';
import fs from 'fs';

export class CreateGitIgnoreStep implements CreateAppStep {
  run(ctx: StepContext, next: () => void): Promise<void> | void {
    const projectRoot = ctx.get<string>('projectRoot');
    const gitIgnorePath = `${projectRoot}/.gitignore`;
    const gitIgnoreContent = `node_modules\n.asteroide`;
    fs.writeFileSync(gitIgnorePath, gitIgnoreContent);
    next();
  }
}
