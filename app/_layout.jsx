import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import { store } from '../redux/store'; // Correct relative import

// Suppress componentWillMount deprecation warning from expo-vector-icons
LogBox.ignoreLogs(['componentWillMount has been renamed']);
LogBox.ignoreAllLogs(false); // Keep other warnings visible

// Suppress React lifecycle warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('componentWillMount')
  ) {
    return;
  }
  originalWarn(...args);
};

// This is the root layout file for Expo Router.
// It wraps the entire application with the Redux provider.
export default function RootLayout() {
  return (
    // Wrap the entire app with Redux Provider
    <Provider store={store}>
      {/* Render child routes (layouts/screens) */}
      <Slot />
    </Provider>
  );
}