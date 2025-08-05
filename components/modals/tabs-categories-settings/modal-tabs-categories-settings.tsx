import { Icon } from '@/components/icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategoryType } from '@/lib/hooks'
import { useCategoryViewStore } from '@/lib/storage/category-view-store'
import {
  useTabsCategoriesSettingsModalActions,
  useTabsCategoriesSettingsModalState
} from '@/lib/storage/tabs-categories-settings-modal-store'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Modal } from '../modal'

export function TabsCategoriesSettings() {
  const { visible } = useTabsCategoriesSettingsModalState()
  const { close } = useTabsCategoriesSettingsModalActions()
  const { viewType, toggleViewType } = useCategoryViewStore()
  const categoryType = useCategoryType()

  const handleEditPress = () => {
    close()
    router.push(`/categories/${categoryType}`)
  }

  return (
    <Modal isVisible={visible} onClose={close} height="auto">
      <View className="px-6 pb-6">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Icon name="Settings" size={20} className="text-primary" />
            <Text className="text-lg font-semibold text-foreground">
              Categories Settings
            </Text>
          </View>
          <Icon name="Target" size={14} className="text-muted-foreground" />
        </View>

        {/* View Type Section */}
        <Card className="mb-4 border-border/50 bg-background/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-foreground">
              Category View
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => viewType !== 'compact' && toggleViewType()}
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3.5 transition-all ${
                  viewType === 'compact'
                    ? 'border-2 border-primary/30 bg-primary/5'
                    : 'border border-border/60 bg-muted/30'
                }`}
              >
                <Icon
                  name="SquarePen"
                  size={16}
                  className={
                    viewType === 'compact'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    viewType === 'compact'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Compact
                </Text>
              </Pressable>

              <Pressable
                onPress={() => viewType !== 'extended' && toggleViewType()}
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3.5 transition-all ${
                  viewType === 'extended'
                    ? 'border-2 border-primary/30 bg-primary/5'
                    : 'border border-border/60 bg-muted/30'
                }`}
              >
                <Icon
                  name="List"
                  size={16}
                  className={
                    viewType === 'extended'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    viewType === 'extended'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Extended
                </Text>
              </Pressable>
            </View>
            <Text className="mt-2 text-xs text-muted-foreground">
              {viewType === 'compact'
                ? 'Grid layout with category icons only'
                : 'List layout with detailed information'}
            </Text>
          </CardContent>
        </Card>

        {/* Management Section */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-foreground">
              Category Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Pressable
              onPress={handleEditPress}
              className="flex-row items-center justify-between rounded-xl border border-border/60 bg-card p-4 active:bg-muted/50"
            >
              <View className="flex-row items-center gap-3">
                <View className="rounded-lg bg-orange-500/10 p-2">
                  <Icon name="Pencil" size={16} className="text-orange-600" />
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
              <Icon
                name="Layers2"
                size={14}
                className="text-muted-foreground"
              />
            </Pressable>
          </CardContent>
        </Card>
      </View>
    </Modal>
  )
}
