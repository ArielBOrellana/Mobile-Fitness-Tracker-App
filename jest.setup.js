// Setup for React Native Testing Library
// Note: extend-expect matchers are now built into @testing-library/react-native v12.4+

// Suppress Expo Winter warnings and errors in tests
global.__ExpoImportMetaRegistry = {};
global.structuredClone = global.structuredClone || ((val) => JSON.parse(JSON.stringify(val)));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  Link: 'Link',
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  Feather: 'Feather',
}));
