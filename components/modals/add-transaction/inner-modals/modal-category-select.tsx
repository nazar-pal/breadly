import { Icon } from '@/components/icon'
import { CenteredModal } from '@/components/modals'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { CategoryModalProps } from '../types'

export function CategoryModal({
  visible,
  type,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onClose
}: CategoryModalProps) {
  const availableCategories = categories.filter(cat => cat.type === type)

  // Group categories into pairs for two-column layout
  const categoryPairs = []
  for (let i = 0; i < availableCategories.length; i += 2) {
    const pair = availableCategories.slice(i, i + 2)
    categoryPairs.push(pair)
  }

  return (
    <CenteredModal
      visible={visible}
      onRequestClose={onClose}
      className="max-h-[60%]"
    >
      <View className="relative">
        <Text className="mb-4 text-xl font-semibold text-foreground">
          Select {type === 'expense' ? 'Expense' : 'Income'} Category
        </Text>
        <Pressable className="absolute -right-2 -top-2 p-2" onPress={onClose}>
          <Icon name="X" className="h-5 w-5 text-muted-foreground" />
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {categoryPairs.map((pair, index) => (
          <View key={index} className="mb-2 flex-row gap-2">
            {pair.map(cat => (
              <Pressable
                key={cat.id}
                className={`flex-1 rounded-lg border p-4 ${
                  cat.id === selectedCategoryId
                    ? 'border-primary bg-primary/20'
                    : 'border-border bg-transparent active:bg-muted'
                }`}
                onPress={() => {
                  onSelectCategory(cat.id)
                  onClose()
                }}
              >
                <Text className="text-center text-base font-medium text-foreground">
                  {cat.name}
                </Text>
              </Pressable>
            ))}
            {/* Add spacer if odd number of items */}
            {pair.length === 1 && <View className="flex-1" />}
          </View>
        ))}
      </ScrollView>
    </CenteredModal>
  )
}
