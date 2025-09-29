import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useCategoryType } from '@/lib/hooks'
import {
  useTabsCategoriesSettingsModalActions,
  useTabsCategoriesSettingsModalState
} from '@/lib/storage/tabs-categories-settings-modal-store'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, View } from 'react-native'
import { Modal } from '../modal'

export function TabsCategoriesSettings() {
  const { visible } = useTabsCategoriesSettingsModalState()
  const { close } = useTabsCategoriesSettingsModalActions()
  const categoryType = useCategoryType()

  const handleEditPress = () => {
    close()
    router.push(`/categories/${categoryType}`)
  }

  return (
    <Modal isVisible={visible} onClose={close} height="auto">
      <View className="px-6 pb-6">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Icon name="Settings" size={20} className="text-primary" />
            <Text className="text-lg font-semibold text-foreground">
              Categories Settings
            </Text>
          </View>
          <Icon name="Target" size={16} className="text-muted-foreground" />
        </View>

        <Pressable
          onPress={handleEditPress}
          className="flex-row items-center justify-between rounded-xl border border-border/60 bg-secondary p-4 active:opacity-80"
        >
          <View className="flex-row items-center gap-3">
            <View className="rounded-lg bg-primary/10 p-2">
              <Icon name="Pencil" size={16} className="text-primary" />
            </View>
            <View>
              <Text className="font-medium text-foreground">
                Edit Categories
              </Text>
              <Text className="text-xs text-muted-foreground">
                Add, remove, or reorder categories
              </Text>
            </View>
          </View>
          <Icon name="Layers2" size={14} className="text-muted-foreground" />
        </Pressable>
      </View>
    </Modal>
  )
}
