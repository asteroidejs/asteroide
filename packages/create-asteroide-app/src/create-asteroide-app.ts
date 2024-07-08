import { StepRunner } from './step-runner';
import {
  ChangeProjectInfoStep,
  CopyTemplateFilesStep,
  InitGitRepositoryStep,
  InstallDependenciesStep,
  MakeProjectRootStep,
  MakeQuestionsStep,
  SelectProjectTemplateStep,
} from './steps';
import picocolors from 'picocolors';
import path from 'path';

export async function createAsteroideApp() {
  const runner = new StepRunner([
    new MakeQuestionsStep(),
    new MakeProjectRootStep(),
    new SelectProjectTemplateStep(),
    new CopyTemplateFilesStep(),
    new ChangeProjectInfoStep(),
    new InstallDependenciesStep(),
    new InitGitRepositoryStep(),
  ]);

  await runner.run();

  const relativePath = path.relative(
    process.cwd(),
    runner.ctx.get<string>('projectPath'),
  );

  const messages = [
    'Hold onto your hats! An Asteroide is coming!\n',
    'To get started, run the following commands:',
    '├───> cd ' + picocolors.cyan(relativePath),
    '└───> npm run dev\n',
    'For more information, check out the Asteroide.js documentation: https://docs.asteroidejs.com',
  ];

  console.log(picocolors.green(messages.join('\n')));
}
