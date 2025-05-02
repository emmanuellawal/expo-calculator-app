import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CalculationHistoryProvider } from './index';

export default function TabLayout() {
  return (
    <CalculationHistoryProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(184, 198, 219, 0.6)',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(20, 30, 48, 0.95)',
            borderTopWidth: 0.5,
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Calculator',
            tabBarIcon: ({ color }) => <Ionicons name="calculator" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <Ionicons name="time" size={28} color={color} />,
          }}
        />
      </Tabs>
    </CalculationHistoryProvider>
  );
}
