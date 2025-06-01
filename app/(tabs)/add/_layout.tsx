import { Stack } from 'expo-router';
import React from 'react';
import AddExpenseHeader from '@/components/navigation/AddExpenseHeader';

export default function AddLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <AddExpenseHeader currentMode="manual" />,
        }}
      />
      <Stack.Screen
        name="photo"
        options={{
          header: () => <AddExpenseHeader currentMode="photo" />,
        }}
      />
      <Stack.Screen
        name="voice"
        options={{
          header: () => <AddExpenseHeader currentMode="voice" />,
        }}
      />
    </Stack>
  );
}