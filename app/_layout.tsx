import { Stack } from 'expo-router';
import { CalculationHistoryProvider } from './(tabs)/index';

export default function RootLayout() {
  return (
    <CalculationHistoryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </CalculationHistoryProvider>
  );
}
