import { Stack } from 'expo-router';

export default function IncomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Income Overview',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="manage"
        options={{
          title: 'Income Sources',
          headerShown: true,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}