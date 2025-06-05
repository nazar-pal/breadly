import { useTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';

export default function ExpensesLayout() {
  const { colors } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Expense Details',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
        }}
      />
    </Stack>
  );
}
