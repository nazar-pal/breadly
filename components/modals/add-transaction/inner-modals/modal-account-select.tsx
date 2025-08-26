import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import { formatCurrencyWithSign } from '@/lib/utils/format-currency'
import React from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'
import { AccountModalProps } from '../types'

export function AccountModal({
  visible,
  accounts,
  selectedAccountId,
  currencies,
  selectedCurrencyCode,
  onSelectCurrency,
  onSelectAccount,
  onClose
}: AccountModalProps) {
  const [tab, setTab] = React.useState<'account' | 'currency'>('account')
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black/10 p-4">
        <View className="max-h-[80%] rounded-2xl bg-card p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-semibold text-foreground">
              Select Account or Currency
            </Text>
          </View>

          <Tabs
            value={tab}
            onValueChange={(value: string) =>
              setTab(value as 'account' | 'currency')
            }
          >
            <TabsList className="mb-3">
              <TabsTrigger value="account">
                <Icon
                  name="CreditCard"
                  size={14}
                  className="mr-1 text-foreground"
                />
                <Text>Accounts</Text>
              </TabsTrigger>
              <TabsTrigger value="currency">
                <Icon
                  name="DollarSign"
                  size={14}
                  className="mr-1 text-foreground"
                />
                <Text>Currencies</Text>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <View className="max-h-96">
                <ScrollView showsVerticalScrollIndicator={false}>
                  {accounts.length === 0 ? (
                    <View className="items-center justify-center py-8">
                      <Text className="text-sm text-muted-foreground">
                        No accounts found
                      </Text>
                    </View>
                  ) : (
                    accounts.map(account => (
                      <Pressable
                        key={account.id}
                        className={`my-1 rounded-xl border p-4 ${
                          account.id === selectedAccountId
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-border bg-transparent active:bg-muted'
                        }`}
                        onPress={() => {
                          onSelectAccount(account.id)
                          onClose()
                        }}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <View className="mr-3 rounded-lg bg-primary/10 p-2">
                              <Icon
                                name="Wallet"
                                size={16}
                                className="text-primary"
                              />
                            </View>
                            <Text className="text-base font-medium text-foreground">
                              {account.name}
                            </Text>
                          </View>
                          <Text className="text-sm text-muted-foreground">
                            {formatCurrencyWithSign(
                              account.balance ?? 0,
                              'USD'
                            )}
                          </Text>
                        </View>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              </View>
            </TabsContent>

            <TabsContent value="currency">
              <View className="max-h-96">
                <ScrollView showsVerticalScrollIndicator={false}>
                  {currencies.length === 0 ? (
                    <View className="items-center justify-center py-8">
                      <Text className="text-sm text-muted-foreground">
                        No currencies available
                      </Text>
                    </View>
                  ) : (
                    currencies.map(currency => (
                      <Pressable
                        key={currency.id}
                        className={`my-1 rounded-xl border p-4 ${
                          currency.code === selectedCurrencyCode
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-border bg-transparent active:bg-muted'
                        }`}
                        onPress={() => {
                          onSelectCurrency(currency.code)
                          onClose()
                        }}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <View className="mr-3 rounded-lg bg-primary/10 p-2">
                              <Icon
                                name="DollarSign"
                                size={16}
                                className="text-primary"
                              />
                            </View>
                            <Text className="text-base font-medium text-foreground">
                              {currency.name}
                            </Text>
                          </View>
                          <Text className="text-sm text-muted-foreground">
                            {currency.symbol} {currency.code}
                          </Text>
                        </View>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              </View>
            </TabsContent>
          </Tabs>

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
