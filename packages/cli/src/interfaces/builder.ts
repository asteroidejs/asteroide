export interface Builder {
  build(filePaths: string[]): Promise<void>;
}
