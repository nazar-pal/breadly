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

interface CalculatorModalProps {
  visible: boolean;
  type: 'expense' | 'income';
  category: string | null;
  onSubmit: (data: {
    amount: number;
    category: string;
    comment?: string;
  }) => void;
  onClose: () => void;
}

export default function CalculatorModal({
  visible,
  type,
  category,
  onSubmit,
  onClose,
}: CalculatorModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose} />
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
          {category && (
            <QuickCalculator
              type={type}
              category={category}
              onSubmit={onSubmit}
              onClose={onClose}
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
