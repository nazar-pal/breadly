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
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      />
    </Stack>
  );
}
