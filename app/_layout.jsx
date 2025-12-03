import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import { store } from '../redux/store';

LogBox.ignoreLogs(['componentWillMount has been renamed']);
LogBox.ignoreAllLogs(false);

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

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}