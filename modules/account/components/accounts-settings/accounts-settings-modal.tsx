import { Modal } from '@/components/modals'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Pressable, View } from 'react-native'
import { useAccountSettingsActions, useAccountSettingsState } from '../../store'

export function AccountsSettingsModal() {
  const { visible, showArchived } = useAccountSettingsState()
  const { close, toggleShowArchived } = useAccountSettingsActions()

  return (
    <Modal
      isVisible={visible}
      onClose={close}
      height="auto"
      title="Accounts Settings"
    >
      <View className="my-2 px-4">
        <Pressable
          onPress={toggleShowArchived}
          className="flex-row items-center justify-between rounded-xl border border-border/60 bg-secondary p-4 active:opacity-80"
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
          {showArchived ? (
            <Icon name="ToggleRight" size={32} className="text-primary" />
          ) : (
            <Icon
              name="ToggleLeft"
              size={32}
              className="text-muted-foreground"
            />
          )}
        </Pressable>
      </View>
    </Modal>
  )
}
