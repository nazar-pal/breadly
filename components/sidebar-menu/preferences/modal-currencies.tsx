import { Icon } from '@/components/icon'
import React from 'react'
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CurrencyList } from './modal-currencie-list'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface ModalCurrenciesProps {
  showCurrencyModal: boolean
  setShowCurrencyModal: (show: boolean) => void
}

export function ModalCurrencies({
  showCurrencyModal,
  setShowCurrencyModal
}: ModalCurrenciesProps) {
  const insets = useSafeAreaInsets()

  const handleCloseModal = () => {
    setShowCurrencyModal(false)
  }

  return (
    <View>
      <Modal
        visible={showCurrencyModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <Pressable
            className="absolute inset-0 bg-black/20"
            onPress={handleCloseModal}
          />

          {/* Modal Content */}
          <View
            className="rounded-t-3xl bg-background"
            style={{
              paddingBottom: insets.bottom + 24,
              height: SCREEN_HEIGHT * 0.85
            }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-border/50 px-6 py-5">
              <Text className="text-xl font-bold text-foreground">
                Select Currency
              </Text>
              <Pressable
                onPress={handleCloseModal}
                className="rounded-full p-2 active:bg-muted"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView
              className="flex-1 px-6 py-4"
              showsVerticalScrollIndicator={false}
            >
              <CurrencyList closeModal={handleCloseModal} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}
