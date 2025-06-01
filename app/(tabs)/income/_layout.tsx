import { Stack } from 'expo-router';

export default function IncomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="manage"
        options={{
          presentation: 'card',
          headerShown: true,
          title: 'Manage Income Sources',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}