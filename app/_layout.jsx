import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

// Simple Loading Screen for when Redux is rehydrating
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4338CA" />
    <Text style={styles.loadingText}>Loading Session...</Text>
  </View>
);

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        {/* The Stack Navigator.
          We define the groups (auth) and (tabs) here so the router knows they exist.
          We also define 'index' so the app knows what to load on startup.
        */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* This matches app/index.jsx */}
          <Stack.Screen name="index" /> 
          
          {/* The Auth Group (app/(auth)/*) */}
          <Stack.Screen name="(auth)" />
          
          {/* The Tabs Group (app/(tabs)/*) */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#4338CA',
  },
});