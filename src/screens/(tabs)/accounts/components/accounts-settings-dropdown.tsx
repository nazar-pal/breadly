import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import {
  useAccountSettingsActions,
  useAccountSettingsState
} from '../lib/account-settings-store'

export function AccountsSettingsDropdown() {
  const { showArchived } = useAccountSettingsState()
  const { toggleShowArchived } = useAccountSettingsActions()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-4">
          <Icon name="Settings" size={24} className="text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          closeOnPress={false}
          checked={showArchived}
          onCheckedChange={() => toggleShowArchived()}
        >
          <View className="flex-row items-center gap-3">
            <View className="rounded-lg bg-primary/10 p-2">
              <Icon name="Archive" size={16} className="text-primary" />
            </View>
            <View>
              <Text className="font-medium text-foreground">
                Show archived accounts
              </Text>
              <Text className="text-xs text-muted-foreground">
                Toggle visibility of archived accounts in lists
              </Text>
            </View>
          </View>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
