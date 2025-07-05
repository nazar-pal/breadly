import {
  useCategoriesActions,
  useTransactionModalState
} from '@/lib/storage/categories-store'
import React from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { QuickCalculator } from '../quick-calculator'
import { useCategoryType } from './lib/use-category-type'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export function CalculatorModal() {
  const { isAddTransactionModalOpen, addTransactionSelectedCategory } =
    useTransactionModalState()
  const { closeAddTransactionModal } = useCategoriesActions()

  const insets = useSafeAreaInsets()
  const activeCategoryType = useCategoryType()

  return (
    <Modal
      visible={isAddTransactionModalOpen}
      className="bg-secondary"
      animationType="slide"
      transparent={true}
      onRequestClose={closeAddTransactionModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <Pressable
          className="absolute inset-0"
          onPress={closeAddTransactionModal}
        />
        <View
          className="rounded-t-3xl bg-secondary pt-6"
          style={{ height: SCREEN_HEIGHT * 0.8, paddingBottom: insets.bottom }}
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-accent-foreground" />
          {addTransactionSelectedCategory && (
            <QuickCalculator
              type={activeCategoryType}
              categoryId={addTransactionSelectedCategory}
              onClose={closeAddTransactionModal}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
