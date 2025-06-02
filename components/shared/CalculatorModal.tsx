import { useCategoryContext } from '@/context/CategoryContext';
import { useTheme } from '@/context/ThemeContext';
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
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    modalVisible,
    currentType,
    selectedCategory,
    handleSubmit,
    handleCloseModal,
  } = useCategoryContext();

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
              backgroundColor: colors.background,
              paddingBottom: insets.bottom,
              maxHeight: Platform.select({
                ios: SCREEN_HEIGHT * 0.8,
                android: SCREEN_HEIGHT * 0.8,
                web: SCREEN_HEIGHT * 0.8,
              }),
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
});
