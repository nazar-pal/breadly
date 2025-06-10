import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useCurrency } from '@/context/CurrencyContext'
import { Check, X } from '@/lib/icons'
import { cn } from '@/lib/utils'
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

interface FormData {
  name: string
  description: string
  balance: string
  targetAmount: string
  initialAmount: string
  dueDate: string
  interestRate: string
  institution: string
  person: string
  debtType: 'owed' | 'owedTo'
}

const DEFAULT_FORM_DATA: FormData = {
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
}

function DebtTypeButton({
  label,
  isSelected,
  onPress
}: {
  label: string
  isSelected: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      className={cn(
        'flex-1 flex-row items-center justify-center rounded-xl border py-3',
        isSelected ? 'border-primary bg-primary' : 'border-border bg-card'
      )}
      onPress={onPress}
    >
      {isSelected && (
        <Check size={16} className="text-primary-foreground mr-2" />
      )}
      <Text
        className={cn(
          'text-base font-medium',
          isSelected ? 'text-primary-foreground' : 'text-foreground'
        )}
      >
        {label}
      </Text>
    </Pressable>
  )
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines,
  prefix
}: {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  keyboardType?: 'default' | 'decimal-pad'
  multiline?: boolean
  numberOfLines?: number
  prefix?: string
}) {
  return (
    <View className="mb-6">
      <Text className="text-foreground mb-2 text-base font-semibold">
        {label}
      </Text>
      <View className="flex-row items-center">
        {prefix && (
          <Text className="text-foreground mr-3 text-base">{prefix}</Text>
        )}
        <TextInput
          className={cn(
            'border-border bg-card text-foreground flex-1 rounded-xl border px-4 py-3 text-base',
            multiline ? 'h-[100px] pt-3' : 'min-h-[48px]'
          )}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="hsl(var(--muted-foreground))"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
    </View>
  )
}

export default function EditAccountModal({
  visible,
  account,
  onSave,
  onClose
}: EditAccountModalProps) {
  const { currency } = useCurrency()
  const insets = useSafeAreaInsets()
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)

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
          className="bg-background flex-1 rounded-t-3xl"
          style={{
            marginTop: SCREEN_HEIGHT * 0.1
          }}
        >
          <View className="border-border border-b px-5 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-foreground text-lg font-semibold">
                {getTitle()}
              </Text>
              <Pressable
                onPress={onClose}
                className="rounded p-2 active:opacity-70"
              >
                <X size={24} className="text-foreground" />
              </Pressable>
            </View>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: insets.bottom + 16
            }}
          >
            <FormInput
              label="Account Name"
              value={formData.name}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, name: text }))
              }
              placeholder="Enter account name"
            />

            <FormInput
              label="Description"
              value={formData.description}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, description: text }))
              }
              placeholder="Enter description"
              multiline
              numberOfLines={3}
            />

            <FormInput
              label="Balance"
              value={formData.balance}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, balance: text }))
              }
              placeholder="0.00"
              keyboardType="decimal-pad"
              prefix={currency.symbol}
            />

            {account?.type === 'savings' && (
              <FormInput
                label="Target Amount"
                value={formData.targetAmount}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, targetAmount: text }))
                }
                placeholder="0.00"
                keyboardType="decimal-pad"
                prefix={currency.symbol}
              />
            )}

            {account?.type === 'debt' && (
              <>
                <FormInput
                  label="Initial Amount"
                  value={formData.initialAmount}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, initialAmount: text }))
                  }
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  prefix={currency.symbol}
                />

                <View className="mb-6">
                  <Text className="text-foreground mb-2 text-base font-semibold">
                    Debt Type
                  </Text>
                  <View className="flex-row gap-3">
                    <DebtTypeButton
                      label="I Owe"
                      isSelected={formData.debtType === 'owed'}
                      onPress={() =>
                        setFormData(prev => ({ ...prev, debtType: 'owed' }))
                      }
                    />
                    <DebtTypeButton
                      label="Owed to Me"
                      isSelected={formData.debtType === 'owedTo'}
                      onPress={() =>
                        setFormData(prev => ({ ...prev, debtType: 'owedTo' }))
                      }
                    />
                  </View>
                </View>

                <FormInput
                  label="Person/Institution"
                  value={formData.person}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, person: text }))
                  }
                  placeholder="Enter person or institution name"
                />
              </>
            )}

            <View className="flex-row gap-3 pt-6">
              <Button
                onPress={onClose}
                variant="secondary"
                className="flex-[0.4]"
              >
                <Text className="text-foreground">Cancel</Text>
              </Button>
              <Button
                onPress={handleSave}
                variant="default"
                className="flex-[0.6]"
              >
                <Text className="text-primary-foreground">Save</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
