import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon-by-name'
import { router, Stack } from 'expo-router'

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Transaction Details',
          headerTitleAlign: 'center',
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
