import { Stack } from 'expo-router'

export default function ExpensesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Expense Details',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#FFFFFF'
          },
          headerTintColor: '#6366F1',
          headerTitleStyle: {
            color: '#1A202C',
            fontWeight: '600'
          }
        }}
      />
    </Stack>
  )
}
