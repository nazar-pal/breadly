import { Button } from '@/components/ui/button'
import { Settings } from '@/lib/icons'
import React from 'react'
import { useSettingsModalStore } from './lib/settings-modal-store'

export function SettingsDropdown() {
  const { open } = useSettingsModalStore()

  return (
    <Button variant="ghost" size="icon" className="mr-4" onPress={open}>
      <Settings size={24} className="text-foreground" />
    </Button>
  )
}
