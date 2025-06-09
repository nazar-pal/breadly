import { useCategoryContext } from '@/context/CategoryContext'
import { useThemedStyles } from '@/context/ThemeContext'
import React from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import QuickCalculator from './QuickCalculator'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function CalculatorModal() {
  const insets = useSafeAreaInsets()
  const {
    modalVisible,
    currentType,
    selectedCategory,
    handleSubmit,
    handleCloseModal
  } = useCategoryContext()

  const styles = useThemedStyles(theme => ({
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.shadow
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      maxHeight: Platform.select({
        ios: SCREEN_HEIGHT * 0.8,
        android: SCREEN_HEIGHT * 0.8,
        web: SCREEN_HEIGHT * 0.8
      })
    },
    modalHandle: {
      backgroundColor: theme.colors.borderStrong
    }
  }))

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal} />
        <View
          className="rounded-t-3xl pt-6"
          style={[
            styles.modalContent,
            {
              paddingBottom: insets.bottom
            }
          ]}
        >
          <View
            className="mb-4 h-1 w-10 self-center rounded-full"
            style={styles.modalHandle}
          />
          {selectedCategory && (
            <QuickCalculator
              type={currentType}
              category={selectedCategory}
              onSubmit={handleSubmit}
              onClose={handleCloseModal}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
