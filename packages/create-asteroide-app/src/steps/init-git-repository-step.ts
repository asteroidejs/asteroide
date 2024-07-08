import { CreateAppStep } from '../interfaces';
import { StepContext } from '../types';
import simpleGit from 'simple-git';

export class InitGitRepositoryStep implements CreateAppStep {
  async run(ctx: StepContext, next: () => void): Promise<void> {
    const projectPath = ctx.get<string>('projectPath');
    const initGitRepository = ctx.get<boolean>('initGitRepository');

    if (!initGitRepository) return next();

    const git = simpleGit(projectPath);
    await git.init();
    await git.add('.');
    await git.commit('first commit');

    next();
  }
}
