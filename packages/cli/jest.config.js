const packageName = require('./package.json').name;
const rootConfig = require('../../jest.config');
const path = require('path');

/**@type {import('jest').Config}*/
module.exports = {
  ...rootConfig,
  displayName: packageName,
  rootDir: path.resolve(__dirname),
  coveragePathIgnorePatterns: [
    '<rootDir>/src/types',
    '<rootDir>/src/enums',
    '<rootDir>/src/errors',
    '<rootDir>/src/interfaces',
  ],
};
