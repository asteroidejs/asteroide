import { Builder } from '../interfaces';
import { Config, transformFile } from '@swc/core';
import moment from 'moment';
import { outputFilePath } from '../helpers';
import fs from 'fs';
import path from 'path';
import { Logger } from '@asteroidejs/common';
import { CompiledFile } from '../types';

export class SwcAppBuilder implements Builder {
  private readonly logger = new Logger({
    context: SwcAppBuilder.name,
  });
  private readonly config: Config = {
    jsc: {
      baseUrl: process.cwd(),
      parser: {
        syntax: 'typescript',
      },
      paths: this.extractPathsFromTsConfig(),
      target: 'es2020',
      keepClassNames: true,
    },
    module: {
      type: 'commonjs',
      strict: true,
      strictMode: true,
    },
  };

  async build(filePaths: string[]) {
    const compiledFiles: CompiledFile[] = [];

    for (const filePath of filePaths) {
      const now = moment.now();
      const { code } = await transformFile(filePath, this.config);
      const output = outputFilePath(filePath);
      const relativeOutput = path.relative(process.cwd(), output);

      if (!fs.existsSync(path.dirname(output))) {
        fs.mkdirSync(path.dirname(output), { recursive: true });
      }

      fs.writeFileSync(output, code);

      compiledFiles.push({
        path: relativeOutput,
        duration: moment.now() - now,
      });
    }

    return compiledFiles;
  }

  private extractPathsFromTsConfig() {
    const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.json');

    if (!fs.existsSync(tsConfigPath)) {
      return {};
    }

    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));

    if (!tsConfig.compilerOptions || !tsConfig.compilerOptions.paths) {
      return {};
    }

    return tsConfig.compilerOptions.paths;
  }
}
