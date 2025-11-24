import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // Correct relative import

// This is the root layout file for Expo Router.
// It wraps the entire application with the Redux provider.
export default function RootLayout() {
  return (
    // Wrap the entire app with Redux Provider
    <Provider store={store}>
      {/* Configure the main navigation stack */}
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}