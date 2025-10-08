import { Text } from '@/components/ui/text'
import { useGetCategories } from '@/data/client/queries'
import { useUserSession } from '@/system/session-and-migration/hooks'
import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { CategoryModalProps } from '../types'
import { ParamsModalShell } from './params-modal-shell'

export function CategoryModal({
  visible,
  type,
  selectedCategoryId,
  onSelectCategory,
  onClose
}: Omit<CategoryModalProps, 'categories'>) {
  const { userId } = useUserSession()
  // Get parent categories for modal selection
  const { data: categories = [] } = useGetCategories({
    userId,
    type,
    parentId: null // Only parent categories
  })

  // Group categories into pairs for two-column layout
  const categoryPairs = []
  for (let i = 0; i < categories.length; i += 2) {
    const pair = categories.slice(i, i + 2)
    categoryPairs.push(pair)
  }

  return (
    <ParamsModalShell
      visible={visible}
      onClose={onClose}
      title={`Select ${type === 'expense' ? 'Expense' : 'Income'} Category`}
    >
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
    </ParamsModalShell>
  )
}
