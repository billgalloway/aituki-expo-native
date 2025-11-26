/**
 * Tab Layout
 * Bottom navigation with 5 tabs matching Figma design
 */

import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconLibrary } from '@/components/IconLibrary';
import { Colors } from '@/constants/theme';
import BottomNavigation from '@/components/BottomNavigation';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.light.text,
          tabBarInactiveTintColor: Colors.light.textSecondary,
          headerShown: false,
          tabBarStyle: {
            display: 'none', // Hide default tab bar, using custom BottomNavigation
          },
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconLibrary iconName="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: 'Goals',
            tabBarIcon: ({ color }) => <IconLibrary iconName="target" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="data"
          options={{
            title: 'Data',
            tabBarIcon: ({ color }) => <IconLibrary iconName="data" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            title: 'Health',
            tabBarIcon: ({ color }) => <IconLibrary iconName="heart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="twin"
          options={{
            title: 'Twin',
            tabBarIcon: ({ color }) => <IconLibrary iconName="person" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
