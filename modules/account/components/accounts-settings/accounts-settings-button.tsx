import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useAccountSettingsActions } from '../../store'

export function AccountsSettingsButton() {
  const { open } = useAccountSettingsActions()
  return (
    <Button variant="ghost" size="icon" className="mr-4" onPress={open}>
      <Icon name="Settings" size={24} className="text-foreground" />
    </Button>
  )
}
