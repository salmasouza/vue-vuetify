module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  moduleFileExtensions: ['js', 'json', 'vue'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!**/node_modules/**',
  ],
  coverageReporters: ['html', 'text-summary'],
  transformIgnorePatterns: ['/node_modules/(?!(axios|some-other-package-to-transform)/)'],
};
