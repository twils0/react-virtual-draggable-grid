const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  rootDir: '../',
  roots: ['<rootDir>', '<rootDir>/demo'],
  modulePaths: ['<rootDir>/node_modules', '<rootDir>/demo/node_modules'],
  coverageDirectory: '<rootDir>/coverage',
  setupTestFrameworkScriptFile: '<rootDir>/demo/setupTests.js',
  snapshotSerializers: ['<rootDir>/demo/node_modules/enzyme-to-json/serializer'],
  transform: {
    '.+\\.(jsx?)$': 'babel-jest',
  },
};

module.exports = config;
