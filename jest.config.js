/**@type {import('jest').Config}*/
module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: '.*\\.test\\.ts$',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
  coverageReporters: ['html-spa', 'text'],
  silent: true,
};
