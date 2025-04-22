import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(184, 198, 219, 0.6)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: 'rgba(20, 30, 48, 0.95)',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
        },
        tabBarLabelStyle: {
          fontSize: 20,
          fontWeight: '600',
          paddingBottom: 6,
          fontFamily: 'System',
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="number" color={color} />,
          tabBarItemStyle: {
            borderRightWidth: 0.5,
            borderRightColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
          tabBarItemStyle: {
            borderLeftWidth: 0.5,
            borderLeftColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </Tabs>
  );
}
