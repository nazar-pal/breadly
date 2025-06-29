import { X } from '@/lib/icons'
import React, { use } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CategoriesContext } from './categories-context'
import { CategoryForm } from './category-form'
import { useCategoryType } from './lib/use-category-type'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export function CategoryModal() {
  const { categoryUI } = use(CategoriesContext)

  const {
    categoryModalVisible: visible,
    categoryToEdit: category,
    handleCloseCategoryModal: onClose
  } = categoryUI

  const insets = useSafeAreaInsets()

  const categoryType = useCategoryType()
  const isEditMode = Boolean(category)

  const modalTitle = `${isEditMode ? 'Edit' : 'Add'} ${categoryType === 'income' ? 'Income' : 'Expense'} Category`

  return (
    <View>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View className="flex-1 justify-end">
            {/* Backdrop */}
            <Pressable
              className="absolute inset-0 bg-black/20"
              onPress={onClose}
            />

            {/* Modal Content */}
            <View
              className="rounded-t-3xl border border-border bg-card"
              style={{
                paddingBottom: insets.bottom + 24,
                maxHeight: SCREEN_HEIGHT * 0.85,
                minHeight: SCREEN_HEIGHT * 0.5
              }}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between border-b border-border/50 px-6 py-5">
                <Text className="text-xl font-bold text-foreground">
                  {modalTitle}
                </Text>
                <Pressable
                  onPress={onClose}
                  className="rounded-full p-2 active:bg-muted"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={20} className="text-muted-foreground" />
                </Pressable>
              </View>

              {/* Scrollable Content */}
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 20
                }}
              >
                <CategoryForm />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}
