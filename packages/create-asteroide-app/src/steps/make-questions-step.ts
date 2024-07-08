import prompts from 'prompts';
import picocolors from 'picocolors';
import { CreateAppStep } from '../interfaces';
import { StepContext } from '../types';
import path from 'path';

export class MakeQuestionsStep implements CreateAppStep {
  private readonly questions: prompts.PromptObject[];

  constructor() {
    this.questions = [
      {
        type: 'text',
        name: 'projectName',
        message: `What's the ${picocolors.blue('name')} of your project?`,
        initial: 'my-asteroide-app',
        validate: (value) => (value ? true : 'Project name cannot be empty'),
      },
      {
        type: 'select',
        name: 'packageManager',
        message: `Which ${picocolors.blue('package manager')} would you like to use?`,
        choices: [
          {
            title: 'npm',
            value: 'npm',
          },
          {
            title: 'yarn',
            value: 'yarn',
          },
        ],
      },
      {
        type: 'toggle',
        name: 'initGitRepository',
        message: `Initialize a ${picocolors.blue('git repository')}?`,
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: 'toggle',
        name: 'installDependencies',
        message: `Install ${picocolors.blue('dependencies')}?`,
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
    ];
  }

  async run(ctx: StepContext, next: () => void): Promise<void> {
    const answers = await prompts(this.questions, {
      onCancel: this.onCancel,
    });

    const projectPath = path.resolve(process.cwd(), answers.projectName);

    ctx.set('projectName', path.basename(projectPath));
    ctx.set('projectPath', projectPath);
    ctx.set('packageManager', answers.packageManager);
    ctx.set('initGitRepository', answers.initGitRepository);
    ctx.set('installDependencies', answers.installDependencies);

    next();
  }

  private onCancel() {
    console.log('User cancelled the operation');
    process.exit(1);
  }
}
