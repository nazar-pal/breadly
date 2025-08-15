import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { router, Stack } from 'expo-router'

export default function AccountsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Account Details',
          headerBackTitle: 'Back',
          headerLeft: () => (
            <Button variant="ghost" size="icon" onPress={() => router.back()}>
              <Icon name="ArrowLeft" size={24} className="text-foreground" />
            </Button>
          )
        }}
      />
    </Stack>
  )
}
