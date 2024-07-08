import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import picocolors from 'picocolors';
import { PackageJson, StepContext } from '../types';
import { CreateAppStep } from '../interfaces';

export class SelectProjectTemplateStep implements CreateAppStep {
  readonly availableTemplates: {
    name: string;
    description: string;
    path: string;
  }[];

  constructor() {
    const templates = fs.readdirSync(path.resolve(__dirname, 'templates'));
    this.availableTemplates = templates.map((template) => {
      const pjson: PackageJson = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, 'templates', template, 'package.json'),
          'utf-8',
        ),
      );

      return {
        name: pjson.name,
        description: pjson.description,
        path: path.resolve(__dirname, 'templates', template),
      };
    });
  }

  async run(ctx: StepContext, next: () => void): Promise<void> {
    if (!this.availableTemplates.length) throw new Error('No templates found');

    const { template } = await prompts({
      type: 'select',
      name: 'template',
      message: `Which ${picocolors.blue('template')} would you like to use?`,
      choices: this.availableTemplates.map((template) => ({
        title: template.name,
        value: template.path,
        description: template.description,
      })),
    });

    ctx.set('template', template);
    next();
  }
}
