const packageName = require('./package.json').name;
const rootConfig = require('../../jest.config');
const path = require('path');

/**@type {import('jest').Config}*/
module.exports = {
  ...rootConfig,
  displayName: packageName,
  rootDir: path.resolve(__dirname),
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
};
