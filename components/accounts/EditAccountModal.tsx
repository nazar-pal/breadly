import { Account, useAccounts } from '@/hooks/useAccounts'
import { Check, X } from '@/lib/icons'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface EditAccountModalProps {
  visible: boolean
  account: Account | null
  accountType: 'saving' | 'payment' | 'debt'
  onClose: () => void
}

interface FormData {
  name: string
  description: string
  balance: string
  // Savings fields
  savingsTargetAmount: string
  savingsTargetDate: string
  // Debt fields
  debtInitialAmount: string
  debtIsOwedToMe: boolean
  debtDueDate: string
}

export default function EditAccountModal({
  visible,
  account,
  accountType,
  onClose
}: EditAccountModalProps) {
  const insets = useSafeAreaInsets()
  const { createAccount, updateAccount } = useAccounts()

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      balance: '0',
      savingsTargetAmount: '',
      savingsTargetDate: '',
      debtInitialAmount: '',
      debtIsOwedToMe: false,
      debtDueDate: ''
    }
  })

  useEffect(() => {
    if (account) {
      // Editing existing account
      reset({
        name: account.name,
        description: account.description || '',
        balance: account.balance,
        savingsTargetAmount: account.savingsTargetAmount || '',
        savingsTargetDate: account.savingsTargetDate || '',
        debtInitialAmount: account.debtInitialAmount || '',
        debtIsOwedToMe: account.debtIsOwedToMe || false,
        debtDueDate: account.debtDueDate || ''
      })
    } else {
      // Adding new account
      reset({
        name: '',
        description: '',
        balance: '0',
        savingsTargetAmount: '',
        savingsTargetDate: '',
        debtInitialAmount: '',
        debtIsOwedToMe: false,
        debtDueDate: ''
      })
    }
  }, [account, reset])

  const onSubmit = (data: FormData) => {
    const currentAccountType = account?.type || accountType

    const baseData = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      balance: data.balance
    }

    // Only include type-specific fields for the correct account type
    let typeSpecificData = {}

    if (currentAccountType === 'saving') {
      typeSpecificData = {
        ...(data.savingsTargetAmount && {
          savingsTargetAmount: data.savingsTargetAmount
        }),
        ...(data.savingsTargetDate && {
          savingsTargetDate: data.savingsTargetDate
        })
      }
    } else if (currentAccountType === 'debt') {
      typeSpecificData = {
        ...(data.debtInitialAmount && {
          debtInitialAmount: data.debtInitialAmount
        }),
        ...(data.debtIsOwedToMe !== undefined && {
          debtIsOwedToMe: data.debtIsOwedToMe
        }),
        ...(data.debtDueDate && { debtDueDate: data.debtDueDate })
      }
    }
    // Payment accounts get no type-specific fields

    const finalData = { ...baseData, ...typeSpecificData }

    if (account) {
      // Update existing account - use any type to bypass strict typing for now
      updateAccount.mutate({
        id: account.id,
        ...finalData
      } as any)
    } else {
      // Create new account - use any type to bypass strict typing for now
      createAccount.mutate({
        ...finalData,
        type: accountType,
        currencyId: 'USD' // Default currency for now
      } as any)
    }

    onClose()
  }

  const getTitle = () => {
    if (account) {
      return `Edit ${account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account`
    }
    return `Add ${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account`
  }

  const currentType = account?.type || accountType

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
          <View className="border-b border-border px-5 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-semibold text-foreground">
                {getTitle()}
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <X size={24} className="text-foreground" />
              </Pressable>
            </View>
          </View>

          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 16 }}
          >
            {/* Account Name */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-foreground">
                Account Name
              </Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Account name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="min-h-[48px] rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter account name"
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                  />
                )}
              />
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-foreground">
                Description (Optional)
              </Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-[100px] rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                    style={{ paddingTop: 12 }}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Add a description for this account"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                )}
              />
            </View>

            {/* Initial/Current Balance */}
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-foreground">
                {account ? 'Current Balance' : 'Initial Balance'}
              </Text>
              <Controller
                control={control}
                name="balance"
                rules={{ required: 'Balance is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex-row items-center">
                    <Text className="mr-3 text-base text-foreground">$</Text>
                    <TextInput
                      className="min-h-[48px] flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="decimal-pad"
                    />
                  </View>
                )}
              />
            </View>

            {/* Conditional Fields Based on Account Type */}
            {currentType === 'saving' && (
              <>
                {/* Savings Target Amount */}
                <View className="mb-6">
                  <Text className="mb-2 text-base font-semibold text-foreground">
                    Savings Goal (Optional)
                  </Text>
                  <Controller
                    control={control}
                    name="savingsTargetAmount"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className="flex-row items-center">
                        <Text className="mr-3 text-base text-foreground">
                          $
                        </Text>
                        <TextInput
                          className="min-h-[48px] flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="0.00"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="decimal-pad"
                        />
                      </View>
                    )}
                  />
                </View>

                {/* Savings Target Date */}
                <View className="mb-6">
                  <Text className="mb-2 text-base font-semibold text-foreground">
                    Target Date (Optional)
                  </Text>
                  <Controller
                    control={control}
                    name="savingsTargetDate"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className="min-h-[48px] rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9CA3AF"
                      />
                    )}
                  />
                </View>
              </>
            )}

            {currentType === 'debt' && (
              <>
                {/* Debt Initial Amount */}
                <View className="mb-6">
                  <Text className="mb-2 text-base font-semibold text-foreground">
                    Original Debt Amount
                  </Text>
                  <Text className="mb-2 text-sm text-muted-foreground">
                    How much was originally borrowed or owed?
                  </Text>
                  <Controller
                    control={control}
                    name="debtInitialAmount"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className="flex-row items-center">
                        <Text className="mr-3 text-base text-foreground">
                          $
                        </Text>
                        <TextInput
                          className="min-h-[48px] flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="0.00"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="decimal-pad"
                        />
                      </View>
                    )}
                  />
                </View>

                {/* Debt Is Owed To Me */}
                <View className="mb-6">
                  <Text className="mb-2 text-base font-semibold text-foreground">
                    Debt Direction
                  </Text>
                  <Text className="mb-2 text-sm text-muted-foreground">
                    Is this money someone owes you, or money you owe?
                  </Text>
                  <Controller
                    control={control}
                    name="debtIsOwedToMe"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className="flex-row gap-2">
                        <Pressable
                          className={`flex-1 rounded-xl border py-3 ${
                            !value
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card'
                          }`}
                          onPress={() => onChange(false)}
                        >
                          <Text
                            className={`text-center text-base font-semibold ${
                              !value ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            I Owe Money
                          </Text>
                        </Pressable>
                        <Pressable
                          className={`flex-1 rounded-xl border py-3 ${
                            value
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card'
                          }`}
                          onPress={() => onChange(true)}
                        >
                          <Text
                            className={`text-center text-base font-semibold ${
                              value ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            Owed To Me
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  />
                </View>

                {/* Debt Due Date */}
                <View className="mb-6">
                  <Text className="mb-2 text-base font-semibold text-foreground">
                    Due Date (Optional)
                  </Text>
                  <Controller
                    control={control}
                    name="debtDueDate"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className="min-h-[48px] rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9CA3AF"
                      />
                    )}
                  />
                </View>
              </>
            )}
          </ScrollView>

          {/* Footer */}
          <View
            className="flex-row gap-3 border-t border-border px-5 py-4"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <Pressable
              className="min-h-[48px] flex-[0.4] flex-row items-center justify-center rounded-xl border border-border py-3"
              onPress={onClose}
            >
              <Text className="text-base font-semibold text-foreground">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              className="min-h-[48px] flex-[0.6] flex-row items-center justify-center rounded-xl bg-primary py-3"
              onPress={handleSubmit(onSubmit)}
              disabled={createAccount.isPending || updateAccount.isPending}
            >
              <Check size={20} className="mr-2 text-primary-foreground" />
              <Text className="text-base font-semibold text-primary-foreground">
                {createAccount.isPending || updateAccount.isPending
                  ? 'Saving...'
                  : account
                    ? 'Save Changes'
                    : 'Create Account'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
