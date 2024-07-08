/**@type {import('jest').Config}*/
module.exports = {
  ...require('../jest.config'),
  testRegex: ['.*\\.e2e-spec\\.ts$'],
  rootDir: __dirname,
};
