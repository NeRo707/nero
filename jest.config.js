module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^../../../models/(.*)$': '<rootDir>/src/models/$1',
    '^../../../utils/(.*)$': '<rootDir>/src/utils/$1',
  },
};