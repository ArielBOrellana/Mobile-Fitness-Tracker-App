import React from 'react';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { useSegments } from 'expo-router';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Layout() {
  const segments = useSegments(); // Get current route segments to determine active tab 
  const active = segments[segments.length - 1] ? segments[segments.length - 1].toLowerCase() : ''; // last segment is active tab name

  // Define colors for active and inactive tab icons and text

  const ACTIVE_COLOR = '#4338CA';
  const INACTIVE_COLOR = '#9CA3AF';
  const ACTIVE_BG = '#EEF2FF';

  const tabStyle = (name) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: active === name.toLowerCase() ? ACTIVE_BG : 'transparent',
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 6,
  });

  // Helpers to determine icon color based on active tab
  const iconColor = (name) => (active === name.toLowerCase() ? ACTIVE_COLOR : INACTIVE_COLOR);

  return (
    <Tabs>
      <TabSlot />
      <TabList
        style={{
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <TabTrigger name="Home" href="/(tabs)/Home" style={tabStyle('home')}>
          <Feather name="home" size={24} color={iconColor('home')} />
          <View style={{ height: 4 }} />
          <Text style={{ fontSize: 12, color: iconColor('home') }}>Home</Text>
        </TabTrigger>

        <TabTrigger name="Analytics" href="/(tabs)/Analytics" style={tabStyle('analytics')}>
          <Feather name="bar-chart-2" size={24} color={iconColor('analytics')} />
          <View style={{ height: 4 }} />
          <Text style={{ fontSize: 12, color: iconColor('analytics') }}>Analytics</Text>
        </TabTrigger>

        <TabTrigger name="AddWorkout" href="/(tabs)/AddWorkout" style={tabStyle('addworkout')}>
          <Feather name="plus" size={24} color={iconColor('addworkout')} />
          <View style={{ height: 4 }} />
          <Text style={{ fontSize: 12, color: iconColor('addworkout') }}>Add</Text>
        </TabTrigger>

        <TabTrigger name="Search" href="/(tabs)/Search" style={tabStyle('search')}>
          <Feather name="search" size={24} color={iconColor('search')} />
          <View style={{ height: 4 }} />
          <Text style={{ fontSize: 12, color: iconColor('search') }}>Search</Text>
        </TabTrigger>

        <TabTrigger name="Profile" href="/(tabs)/Profile" style={tabStyle('profile')}>
          <Feather name="user" size={24} color={iconColor('profile')} />
          <View style={{ height: 4 }} />
          <Text style={{ fontSize: 12, color: iconColor('profile') }}>Profile</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}