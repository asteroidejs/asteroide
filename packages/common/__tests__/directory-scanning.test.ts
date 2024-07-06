import { DirectoryScanner } from '../src';
import { ScanOptions } from '../src';

describe('Directory Scanning', () => {
  test('should found ts files on `src` directory', async () => {
    const onFile = jest.fn();
    const options: ScanOptions = {
      rootDir: 'src',
      searchFor: [/\.ts$/],
      onFile,
    };

    const scanner = new DirectoryScanner(options);
    await scanner.scan();

    expect(onFile).toHaveBeenCalledWith('src/directory-scanner.ts');
  });

  test('should ignore files with `ignore` option', async () => {
    const onFile = jest.fn();
    const options: ScanOptions = {
      rootDir: 'src',
      searchFor: [/\.ts$/],
      ignore: [/directory-scanner.ts/],
      onFile,
    };

    const scanner = new DirectoryScanner(options);
    await scanner.scan();

    expect(onFile).not.toHaveBeenCalledWith('src/directory-scanner.ts');
  });

  test('should not scan subdirectories when `onlyRootDir` is true', async () => {
    const onFile = jest.fn();
    const options: ScanOptions = {
      rootDir: 'src',
      searchFor: [/\.ts$/],
      onlyRootDir: true,
      onFile,
    };

    const scanner = new DirectoryScanner(options);
    await scanner.scan();

    expect(onFile).not.toHaveBeenCalledWith(
      expect.stringMatching(/src\/types/),
    );
  });

  test('should scan subdirectories when `onlyRootDir` is false', async () => {
    const onFile = jest.fn();
    const options: ScanOptions = {
      rootDir: 'src',
      searchFor: [/\.ts$/],
      onlyRootDir: false,
      onFile,
    };

    const scanner = new DirectoryScanner(options);
    await scanner.scan();

    expect(onFile).toHaveBeenCalledWith('src/types/index.ts');
  });

  test('should throw an error when `rootDir` does not exist', () => {
    const options = {
      rootDir: 'non-existing-dir',
    };

    const scanner = new DirectoryScanner(options as ScanOptions);

    expect(scanner.scan()).rejects.toThrow(
      'Directory non-existing-dir does not exist',
    );
  });
});
