import { Modal as SheetModal } from '@/components/modals/modal'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { CurrencyList } from './modal-currencie-list'

interface ModalCurrenciesProps {
  showCurrencyModal: boolean
  setShowCurrencyModal: (show: boolean) => void
}

export function ModalCurrencies({
  showCurrencyModal,
  setShowCurrencyModal
}: ModalCurrenciesProps) {
  const handleCloseModal = () => {
    setShowCurrencyModal(false)
  }

  return (
    <View>
      <SheetModal
        isVisible={showCurrencyModal}
        onClose={handleCloseModal}
        height={0.85}
        additionalSafeAreaPadding={24}
        enableBackdropClose
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border/10 px-6 py-5">
          <Text className="text-xl font-bold text-popover-foreground">
            Select Currency
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-6 py-4"
          showsVerticalScrollIndicator={false}
        >
          <CurrencyList closeModal={handleCloseModal} />
        </ScrollView>
      </SheetModal>
    </View>
  )
}
