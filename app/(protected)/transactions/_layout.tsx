import { Stack } from 'expo-router'

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Transaction Details',
          headerBackTitle: 'Back'
        }}
      />
    </Stack>
  )
}
