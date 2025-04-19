import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '.*\\.module\\.ts$',
    'main\\.ts$', //
  ],
  testEnvironment: 'node',
};

export default config;
