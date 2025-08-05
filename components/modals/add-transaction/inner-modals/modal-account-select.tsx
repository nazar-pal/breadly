import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'
import { AccountModalProps } from '../types'

export function AccountModal({
  visible,
  accounts,
  selectedAccountId,
  onSelectAccount,
  onClose
}: AccountModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black/10 p-4">
        <View className="max-h-[80%] rounded-2xl bg-card p-4">
          <Text className="mb-4 text-xl font-semibold text-foreground">
            Select Account
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {accounts.map(account => (
              <Pressable
                key={account.id}
                className={`my-1 rounded-lg p-4 ${
                  account.id === selectedAccountId
                    ? 'bg-primary/10'
                    : 'bg-transparent active:bg-muted'
                }`}
                onPress={() => {
                  onSelectAccount(account.id)
                  onClose()
                }}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-medium text-foreground">
                    {account.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    ${account.balance?.toFixed(2) ?? '0.00'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <View className="mt-4">
            <Button onPress={onClose} variant="outline" className="w-full">
              <Text>Close</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}
