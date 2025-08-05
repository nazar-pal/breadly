import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black/10 p-4">
        <View className="max-h-[80%] rounded-2xl bg-card p-4">
          <Text className="mb-4 text-xl font-semibold text-foreground">
            Select {type === 'expense' ? 'Expense' : 'Income'} Category
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {availableCategories.map(cat => (
              <Pressable
                key={cat.id}
                className={`my-1 rounded-lg p-4 ${
                  cat.id === selectedCategoryId
                    ? 'bg-primary/10'
                    : 'bg-transparent active:bg-muted'
                }`}
                onPress={() => {
                  onSelectCategory(cat.id)
                  onClose()
                }}
              >
                <Text className="text-base font-medium text-foreground">
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View className="mt-4">
            <Button onPress={onClose} variant="outline" className="w-full">
              <Text>Close</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}
