import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AddLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
          animation: 'none', // Disable default navigation animation
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Add Expense',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="photo"
          options={{
            title: 'Receipt Photo',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="voice"
          options={{
            title: 'Voice Entry',
            presentation: 'modal',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}