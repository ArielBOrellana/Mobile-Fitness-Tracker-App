import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; 

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Active tab color (Indigo-700 to match your theme)
        tabBarActiveTintColor: '#4338CA', 
        // Inactive tab color (Gray-400)
        tabBarInactiveTintColor: '#9CA3AF',
        // Styling the tab bar to look clean and modern
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        // Hides the standard header for all tabs by default 
        // (since each screen usually has its own custom header or content)
        headerShown: false, 
      }}
    >
      {/* Tab 1: Home
        This maps to app/(tabs)/Home.jsx 
      */}
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          // Icon for the Home tab
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />

      {/* Tab 2: Profile
        This maps to app/(tabs)/Profile.jsx
      */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      /> 
    </Tabs>
  );
}