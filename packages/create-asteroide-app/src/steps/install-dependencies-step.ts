import { spawn } from 'child_process';
import { CreateAppStep } from '../interfaces';
import { StepContext } from '../types';

export class InstallDependenciesStep implements CreateAppStep {
  async run(ctx: StepContext, next: () => void): Promise<void> {
    const packageManager = ctx.get<string>('packageManager');
    const projectPath = ctx.get<string>('projectPath');
    const installDependencies = ctx.get<boolean>('installDependencies');

    if (!installDependencies) return next();

    console.log();
    const installProcess = spawn(packageManager, ['install'], {
      cwd: projectPath,
      stdio: 'inherit',
      shell: true,
    });

    installProcess.on('close', (code) => {
      if (code === 0) {
        next();
      } else {
        throw new Error(`Failed to install dependencies with code ${code}`);
      }
    });
  }
}
