import { Stack } from 'expo-router';

export default function AddLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
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
  );
}