import React, { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Stack, Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

// --- 1. Authentication Gate Component ---
// This component reads the Redux state and handles redirection.
const AuthGate = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  
  // 1. If the user is logged in, redirect them away from the public auth screens
  if (currentUser) {
      // If the user is logged in, they should NOT be on /SignIn or /SignUp. 
      // Redirect them to the protected area.
      return <Redirect href="/Home" />; 
  }

  return (
    // 2. If the user is NOT logged in, render the necessary screens.
    // The router only needs the paths defined below.
    <Stack>
      {/* 
        Define the Public Routes (Auth) 
        The router already knows about /(auth)/SignIn and /(auth)/SignUp 
      */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      {/* 
        Define the Protected Routes (Tabs) 
        If the user gets here while logged out, the logic above should have stopped them.
      */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
    </Stack>
  );
};

// --- 2. Root Component (Handles Redux and Persistence) ---
const RootLayout = () => {
  return (
    // Step 1: Wrap the application in the Redux store
    <Provider store={store}>
      {/* 
        Step 2: Use PersistGate to wait for Redux state (including the currentUser status) 
        to be rehydrated from AsyncStorage before rendering the app components. 
      */}
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        {/* Step 3: Render the Authentication Gate */}
        <AuthGate />
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;

// Simple Loading Screen for when Redux is rehydrating
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4338CA" />
    <Text style={styles.loadingText}>Loading Session...</Text>
  </View>
);

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