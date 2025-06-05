import { useCategoryContext } from '@/context/CategoryContext';
import { useThemedStyles } from '@/context/ThemeContext';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QuickCalculator from './QuickCalculator';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CalculatorModal() {
  const insets = useSafeAreaInsets();
  const {
    modalVisible,
    currentType,
    selectedCategory,
    handleSubmit,
    handleCloseModal,
  } = useCategoryContext();

  const styles = useThemedStyles((theme) => ({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end' as const,
    },
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.shadow,
    },
    modalContent: {
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.background,
      maxHeight: Platform.select({
        ios: SCREEN_HEIGHT * 0.8,
        android: SCREEN_HEIGHT * 0.8,
        web: SCREEN_HEIGHT * 0.8,
      }),
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.borderStrong,
      borderRadius: 2,
      alignSelf: 'center' as const,
      marginBottom: theme.spacing.md,
    },
  }));

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal} />
        <View
          style={[
            styles.modalContent,
            {
              paddingTop: 24,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <View style={styles.modalHandle} />
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
  );
}
