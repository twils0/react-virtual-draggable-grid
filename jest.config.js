const config = {
  verbose: true,
  collectCoverage: true,
  testEnvironment: 'jsdom',
  roots: ['<rootDir>', '<rootDir>/demo'],
  modulePaths: ['<rootDir>/node_modules', '<rootDir>/demo/node_modules'],
  coverageDirectory: '<rootDir>/coverage',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '.+\\.(jsx?)$': 'babel-jest',
  },
};

module.exports = config;
