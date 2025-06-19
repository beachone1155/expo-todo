module.exports = {
  preset: 'jest-expo',
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx|js)',
    '**/?(*.)+(spec|test).(ts|tsx|js)'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    // 画像やアセットをモック
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Expo Vector Iconsなどをモック
    '^@expo/vector-icons$': '<rootDir>/__mocks__/expoVectorIconsMock.js',
  },
  roots: ['<rootDir>', '<rootDir>/app', '<rootDir>/components', '<rootDir>/hooks'],
  moduleDirectories: ['node_modules', '<rootDir>', '<rootDir>/app', '<rootDir>/components', '<rootDir>/hooks'],
  transformIgnorePatterns: [
    'node_modules/(?!(expo|@expo|react-native|@react-native|@react-navigation|@testing-library|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|react-native-safe-area-context|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-web|@react-native-community|@react-native-picker|@react-native-masked-view|@react-native-async-storage)/)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
}; 