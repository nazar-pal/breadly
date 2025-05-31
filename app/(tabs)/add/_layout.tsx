import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AddLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
          animation: 'none',
          headerTitleStyle: {
            fontSize: 28,
            fontWeight: '700',
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Add Expense',
          }}
        />
        <Stack.Screen
          name="photo"
          options={{
            title: 'Receipt Photo',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="voice"
          options={{
            title: 'Voice Entry',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}