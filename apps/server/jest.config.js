module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  setupFilesAfterEnv: ['./src/__tests__/setup/index.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  watchPathIgnorePatterns: ['globalConfig'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
