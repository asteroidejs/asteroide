import { PackageJson, StepContext } from '../types';
import fs from 'fs';
import { CreateAppStep } from '../interfaces';
import path from 'path';

export class ChangeProjectInfoStep implements CreateAppStep {
  async run(ctx: StepContext, next: () => void): Promise<void> {
    const projectPath = ctx.get<string>('projectPath');
    const pJsonPath = path.resolve(projectPath, 'package.json');
    const pJson: PackageJson = JSON.parse(fs.readFileSync(pJsonPath, 'utf-8'));

    pJson.name = path.basename(projectPath);
    pJson.version = '0.1.0';
    pJson.description = '';

    fs.writeFileSync(pJsonPath, JSON.stringify(pJson, null, 2));
    next();
  }
}
