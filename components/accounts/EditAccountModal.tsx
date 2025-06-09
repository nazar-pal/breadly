import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useCurrency } from '@/context/CurrencyContext'
import { Check, X } from '@/lib/icons'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface EditAccountModalProps {
  visible: boolean
  account: any
  onSave: (account: any) => void
  onClose: () => void
}

export default function EditAccountModal({
  visible,
  account,
  onSave,
  onClose
}: EditAccountModalProps) {
  const { currency } = useCurrency()
  const insets = useSafeAreaInsets()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    balance: '',
    targetAmount: '',
    initialAmount: '',
    dueDate: '',
    interestRate: '',
    institution: '',
    person: '',
    debtType: 'owed'
  })

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        description: account.description || '',
        balance: account.balance?.toString() || '',
        targetAmount: account.targetAmount?.toString() || '',
        initialAmount: account.initialAmount?.toString() || '',
        dueDate: account.dueDate || '',
        interestRate: account.interestRate?.toString() || '',
        institution: account.institution || '',
        person: account.person || '',
        debtType: account.debtType || 'owed'
      })
    }
  }, [account])

  const handleSave = () => {
    const updatedAccount = {
      ...account,
      ...formData,
      balance: parseFloat(formData.balance),
      targetAmount: formData.targetAmount
        ? parseFloat(formData.targetAmount)
        : undefined,
      initialAmount: formData.initialAmount
        ? parseFloat(formData.initialAmount)
        : undefined,
      interestRate: formData.interestRate
        ? parseFloat(formData.interestRate)
        : undefined
    }
    onSave(updatedAccount)
  }

  const getTitle = () => {
    if (!account) return 'Add Account'
    if (!account.id) return `Add ${account.type} Account`
    return `Edit ${account.type} Account`
  }

  return (
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
          <View className="border-border-light flex-row items-center justify-between border-b px-5 py-4">
            <Text className="text-lg font-semibold text-foreground">
              {getTitle()}
            </Text>
            <Pressable onPress={onClose} className="rounded p-2">
              <X size={24} color="#1A202C" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              { padding: 20 },
              { paddingBottom: insets.bottom + 16 }
            ]}
          >
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-foreground">
                Account Name
              </Text>
              <TextInput
                className="min-h-[48px] rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                value={formData.name}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, name: text }))
                }
                placeholder="Enter account name"
                placeholderTextColor="#4A5568"
              />
            </View>

            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-foreground">
                Description
              </Text>
              <TextInput
                className="h-[100px] rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                style={{ paddingTop: 12 }}
                value={formData.description}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, description: text }))
                }
                placeholder="Enter description"
                placeholderTextColor="#4A5568"
                multiline
                numberOfLines={3}
              />
            </View>

            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-foreground">
                Balance
              </Text>
              <View className="flex-row items-center">
                <Text className="mr-3 text-base text-foreground">
                  {currency.symbol}
                </Text>
                <TextInput
                  className="min-h-[48px] flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                  value={formData.balance}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, balance: text }))
                  }
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#4A5568"
                />
              </View>
            </View>

            {/* Type-specific fields */}
            {account?.type === 'savings' && (
              <View className="mb-6">
                <Text className="mb-2 text-base font-semibold text-foreground">
                  Target Amount
                </Text>
                <View className="flex-row items-center">
                  <Text className="mr-3 text-base text-foreground">
                    {currency.symbol}
                  </Text>
                  <TextInput
                    className="min-h-[48px] flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                    value={formData.targetAmount}
                    onChangeText={text =>
                      setFormData(prev => ({ ...prev, targetAmount: text }))
                    }
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#4A5568"
                  />
                </View>
              </View>
            )}

            {account?.type === 'debt' && (
              <>
                <View className="mb-6">
                  <Text className="mb-2 text-base font-semibold text-foreground">
                    Initial Amount
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="mr-3 text-base text-foreground">
                      {currency.symbol}
                    </Text>
                    <TextInput
                      className="min-h-[48px] flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                      value={formData.initialAmount}
                      onChangeText={text =>
                        setFormData(prev => ({ ...prev, initialAmount: text }))
                      }
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#4A5568"
                    />
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="mb-2 text-base font-semibold text-foreground">
                    Debt Type
                  </Text>
                  <View className="flex-row gap-3">
                    <Pressable
                      className="flex-1 flex-row items-center justify-center rounded-xl border py-3"
                      style={{
                        backgroundColor:
                          formData.debtType === 'owed'
                            ? '#6366F1' // colors.primary
                            : '#FFFFFF', // colors.card
                        borderColor:
                          formData.debtType === 'owed'
                            ? '#6366F1' // colors.primary
                            : '#E2E8F0' // colors.border
                      }}
                      onPress={() =>
                        setFormData(prev => ({ ...prev, debtType: 'owed' }))
                      }
                    >
                      {formData.debtType === 'owed' && (
                        <Check
                          size={16}
                          color="#FFFFFF" // colors.textInverse
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <Text
                        className="text-base font-medium"
                        style={{
                          color:
                            formData.debtType === 'owed'
                              ? '#FFFFFF' // colors.textInverse
                              : '#1A202C' // colors.text
                        }}
                      >
                        I Owe
                      </Text>
                    </Pressable>

                    <Pressable
                      className="flex-1 flex-row items-center justify-center rounded-xl border py-3"
                      style={{
                        backgroundColor:
                          formData.debtType === 'owedTo'
                            ? '#6366F1' // colors.primary
                            : '#FFFFFF', // colors.card
                        borderColor:
                          formData.debtType === 'owedTo'
                            ? '#6366F1' // colors.primary
                            : '#E2E8F0' // colors.border
                      }}
                      onPress={() =>
                        setFormData(prev => ({ ...prev, debtType: 'owedTo' }))
                      }
                    >
                      {formData.debtType === 'owedTo' && (
                        <Check
                          size={16}
                          color="#FFFFFF" // colors.textInverse
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <Text
                        className="text-base font-medium"
                        style={{
                          color:
                            formData.debtType === 'owedTo'
                              ? '#FFFFFF' // colors.textInverse
                              : '#1A202C' // colors.text
                        }}
                      >
                        Owed to Me
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="mb-2 text-base font-semibold text-foreground">
                    Person/Institution
                  </Text>
                  <TextInput
                    className="min-h-[48px] rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                    value={formData.person}
                    onChangeText={text =>
                      setFormData(prev => ({ ...prev, person: text }))
                    }
                    placeholder="Enter person or institution name"
                    placeholderTextColor="#4A5568"
                  />
                </View>
              </>
            )}

            <View className="flex-row gap-3 pt-6">
              <Button
                onPress={onClose}
                variant="secondary"
                className="flex-[0.4]"
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                onPress={handleSave}
                variant="default"
                className="flex-[0.6]"
              >
                <Text>Save</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
