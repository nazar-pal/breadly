import { Icon } from '@/components/icon'
import React, { ReactNode } from 'react'
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface BaseAccountModalProps {
  visible: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footerContent: ReactNode
}

export function BaseAccountModal({
  visible,
  title,
  onClose,
  children,
  footerContent
}: BaseAccountModalProps) {
  const insets = useSafeAreaInsets()

  return (
    <View>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View
            className="flex-1 rounded-t-3xl bg-background"
            style={{
              marginTop: SCREEN_HEIGHT * 0.1
            }}
          >
            {/* Header */}
            <View className="border-b border-border px-5 py-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-semibold text-foreground">
                  {title}
                </Text>
                <Pressable onPress={onClose} className="p-1">
                  <Icon name="X" size={24} className="text-foreground" />
                </Pressable>
              </View>
            </View>

            {/* Content */}
            <ScrollView
              className="flex-1 px-5"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
            >
              {children}
            </ScrollView>

            {/* Footer */}
            <View
              className="flex-row gap-3 border-t border-border px-5 py-4"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              {footerContent}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}
