import { Stack } from 'expo-router'

export default function AccountsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Account Details',
          headerBackTitle: 'Back'
        }}
      />
    </Stack>
  )
}
