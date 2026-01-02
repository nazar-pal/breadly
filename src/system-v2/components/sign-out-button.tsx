import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import { useSignOut } from '../orchestrator/use-sync-state'

/**
 * Sign out button that triggers the FSM sign-out flow.
 *
 * The sign-out process is handled by the FSM:
 * 1. Dispatches USER_SIGNED_OUT event
 * 2. Transitions to signing_out state (shows loading UI)
 * 3. Executes sign-out side effects (Clerk, PowerSync, etc.)
 * 4. Transitions to uninitialized on SIGN_OUT_COMPLETE
 * 5. Normal initialization flow creates new guest session
 */
export function SignOutButton() {
  const signOut = useSignOut()

  return (
    <Button
      variant="destructive"
      onPress={signOut}
      className="h-14 w-full rounded-xl"
    >
      <View className="flex-row items-center gap-2">
        <Icon name="LogOut" size={20} className="text-destructive-foreground" />
        <Text className="text-base font-semibold">Sign Out</Text>
      </View>
    </Button>
  )
}
