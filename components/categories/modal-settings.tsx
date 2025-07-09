import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Edit2, List, Settings, SquarePen } from '@/lib/icons'
import { useCategoryViewStore } from '@/lib/storage/category-view-store'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Modal } from '../modal'
import { useSettingsModalStore } from './lib/settings-modal-store'
import { useCategoryType } from './lib/use-category-type'

export function SettingsModal() {
  const { visible } = useSettingsModalStore()
  const { close } = useSettingsModalStore()
  const { viewType, toggleViewType } = useCategoryViewStore()
  const categoryType = useCategoryType()

  const handleEditPress = () => {
    close()
    router.push(`/categories/edit/${categoryType}`)
  }

  return (
    <Modal isVisible={visible} onClose={close} height="40%">
      <View className="px-6 pb-6">
        {/* Header */}
        <View className="mb-6 flex-row items-center gap-3">
          <Settings size={24} className="text-primary" />
          <Text className="text-xl font-bold text-foreground">Settings</Text>
        </View>

        {/* Category View Toggle */}
        <View className="mb-6">
          <Text className="mb-3 text-sm font-medium text-muted-foreground">
            Category View
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => viewType !== 'compact' && toggleViewType()}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg px-4 py-3 ${
                viewType === 'compact'
                  ? 'border border-primary/20 bg-primary/10'
                  : 'border border-border bg-muted/50'
              }`}
            >
              <SquarePen
                size={18}
                className={
                  viewType === 'compact' ? 'text-primary' : 'text-foreground'
                }
              />
              <Text
                className={`font-medium ${
                  viewType === 'compact' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Compact
              </Text>
            </Pressable>

            <Pressable
              onPress={() => viewType !== 'extended' && toggleViewType()}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg px-4 py-3 ${
                viewType === 'extended'
                  ? 'border border-primary/20 bg-primary/10'
                  : 'border border-border bg-muted/50'
              }`}
            >
              <List
                size={18}
                className={
                  viewType === 'extended' ? 'text-primary' : 'text-foreground'
                }
              />
              <Text
                className={`font-medium ${
                  viewType === 'extended' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Extended
              </Text>
            </Pressable>
          </View>
        </View>

        <Separator className="mb-6" />

        {/* Edit Categories */}
        <View>
          <Text className="mb-3 text-sm font-medium text-muted-foreground">
            Category Management
          </Text>
          <Button
            variant="outline"
            className="flex-row items-center justify-start gap-3 py-4"
            onPress={handleEditPress}
          >
            <Edit2 size={18} className="text-foreground" />
            <Text className="text-base text-foreground">Edit Categories</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}
