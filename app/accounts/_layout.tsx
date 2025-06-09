import { Stack } from 'expo-router'

export default function AccountsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Account Details',
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
