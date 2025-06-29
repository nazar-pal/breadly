import React, { use } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { QuickCalculator } from '../shared/quick-calculator'
import { CategoriesContext } from './categories-context'
import { useCategoryType } from './lib/use-category-type'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export function CalculatorModal() {
  const { categoryUI } = use(CategoriesContext)

  const insets = useSafeAreaInsets()
  const activeCategoryType = useCategoryType()
  const {
    addTransactionModalVisible,
    selectedCategory,
    handleCloseAddTransactionModal
  } = categoryUI

  return (
    <Modal
      visible={addTransactionModalVisible}
      className="bg-secondary"
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseAddTransactionModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <Pressable
          className="absolute inset-0"
          onPress={handleCloseAddTransactionModal}
        />
        <View
          className="rounded-t-3xl bg-secondary pt-6"
          style={{ height: SCREEN_HEIGHT * 0.8, paddingBottom: insets.bottom }}
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-accent-foreground" />
          {selectedCategory && (
            <QuickCalculator
              type={activeCategoryType}
              categoryId={selectedCategory}
              onClose={handleCloseAddTransactionModal}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
