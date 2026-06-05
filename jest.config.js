module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^react-redux$': '<rootDir>/node_modules/react-redux/dist/cjs/index.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/asyncStorageMock.js',
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|@reduxjs/toolkit|immer|redux|reselect|react-native-safe-area-context|react-native-screens)/)',
  ],
};
