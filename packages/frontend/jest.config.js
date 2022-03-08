const config = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.ts(x)'],
  setupFilesAfterEnv: [
    '<rootDir>/test/setupTests.ts'
  ],
  "moduleDirectories": ["node_modules", "bower_components", "<rootDir>"],
}

module.exports = config
