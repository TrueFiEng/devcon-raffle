const config = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.ts(x)'],
  setupFilesAfterEnv: [
    '<rootDir>/test/setupTests.ts'
  ]
}

module.exports = config
