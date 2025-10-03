module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleNameMapper: {
        '^@interfaces/(.*)$': '<rootDir>/src/Interfaces/$1',
        '^@repository/(.*)$': '<rootDir>/src/Repository/$1',
        '^@essences/(.*)$': '<rootDir>/src/Essences/$1',
        '^@index/(.*)$': '<rootDir>/src/$1',
        '^@services/(.*)$': '<rootDir>/src/Services/$1',
        '^@front/(.*)$': '<rootDir>/src/Front/$1',
        '^@commands/(.*)$': '<rootDir>/src/Commands/$1',
        '^@facade/(.*)$': '<rootDir>/src/Facade/$1',
    },
};