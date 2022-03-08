const config = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.ts(x)'],
  setupFilesAfterEnv: [
    '<rootDir>/test/setupTests.ts'
  ],
  "moduleDirectories": ["node_modules", "bower_components", "<rootDir>"],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/stubs/filesMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/stubs/stylesMock.js"
  }
}

module.exports = config
