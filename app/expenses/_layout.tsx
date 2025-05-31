import { Stack } from 'expo-router';

export default function ExpensesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Expense Details',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}