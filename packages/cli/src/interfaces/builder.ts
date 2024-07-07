import { CompiledFile } from '../types';

export interface Builder {
  build(filePaths: string[]): Promise<CompiledFile[]>;
}
