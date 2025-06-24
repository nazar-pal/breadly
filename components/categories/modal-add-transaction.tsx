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

  const handleSubmit = () => {
    // Transaction is already created by QuickCalculator, just close modal
    handleCloseAddTransactionModal()
  }

  const getModalContentStyle = () => ({
    backgroundColor: '#F5F5F5', // colors.background
    maxHeight: Platform.select({
      ios: SCREEN_HEIGHT * 0.8,
      android: SCREEN_HEIGHT * 0.8,
      web: SCREEN_HEIGHT * 0.8
    }),
    paddingBottom: insets.bottom
  })

  return (
    <Modal
      visible={addTransactionModalVisible}
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
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} // colors.shadow
          onPress={handleCloseAddTransactionModal}
        />
        <View className="rounded-t-3xl pt-6" style={getModalContentStyle()}>
          <View
            className="mb-4 h-1 w-10 self-center rounded-full"
            style={{ backgroundColor: '#CBD5E0' }} // colors.borderStrong
          />
          {selectedCategory && (
            <QuickCalculator
              type={activeCategoryType}
              categoryId={selectedCategory}
              onSubmit={handleSubmit}
              onClose={handleCloseAddTransactionModal}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
