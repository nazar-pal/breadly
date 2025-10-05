import { Calculator } from '@/components/calculator'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { createTransaction } from '@/data/client/mutations'
import { useGetCurrencies } from '@/data/client/queries'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useGetAccount } from '../lib/use-get-account'
import { useGetCategory } from '../lib/use-get-category'
import { AccountModal } from './inner-modals/modal-account-select'
import { CategoryModal } from './inner-modals/modal-category-select'
import { SubcategorySelection } from './subcategory-selection'

interface Props {
  type: 'expense' | 'income'
  categoryId: string
  accountId?: string
  onClose: () => void
}

export function AddTransaction({
  type,
  categoryId,
  accountId,
  onClose
}: Props) {
  const { userId } = useUserSession()

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)

  const { data } = useGetCategory({ userId, categoryId })

  const category = data.length > 0 ? data[0] : null
  const parentCategory = category?.parent ?? category ?? null

  const { data: accountData = [] } = useGetAccount({
    userId,
    accountId: accountId ?? ''
  })
  const account = accountData.length > 0 ? accountData[0] : null

  const [selectedCurrencyCode, setSelectedCurrencyCode] =
    useState<string>('USD')

  const { data: currencies = [] } = useGetCurrencies()

  const selectedCurrency = (
    currencies.length > 0
      ? currencies
      : [{ code: 'USD', symbol: '$', id: 'USD', name: 'United States Dollar' }]
  ).find(c => c.code === selectedCurrencyCode)

  const handleParentCategorySelect = (categoryId: string) =>
    router.setParams({ categoryId: categoryId })

  const handleSubmit = async (
    amount: number,
    comment: string,
    txDate?: Date
  ) => {
    const hasMoneySource = Boolean(account) || Boolean(selectedCurrency)
    if (amount > 0 && hasMoneySource && parentCategory?.id && userId) {
      await createTransaction({
        userId,
        data: {
          type,
          ...(account ? { accountId: account.id } : {}),
          categoryId: parentCategory.id,
          amount: amount,
          currencyId: account ? account.currencyId : selectedCurrencyCode,
          txDate: txDate ?? new Date(),
          notes: comment || null,
          createdAt: new Date()
        }
      })

      onClose()
    }
  }

  return (
    <>
      {/* Category and Account Selection */}
      <View className="mb-4 flex-row gap-2">
        {/* Category Selector */}
        <Pressable
          className="flex-1 flex-row items-center justify-between rounded-xl bg-card p-2.5 shadow-sm active:bg-muted/50"
          onPress={() => setShowCategoryModal(true)}
        >
          <View className="flex-1 flex-row items-center">
            <View className="mr-2 rounded-lg bg-primary/10 p-1">
              <Icon name="Tag" size={14} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Category
              </Text>
              <Text
                className="text-sm font-semibold text-foreground"
                numberOfLines={1}
              >
                {parentCategory?.name || 'Select Category'}
              </Text>
            </View>
          </View>
          <Icon
            name="ChevronDown"
            size={14}
            className="ml-1 text-muted-foreground"
          />
        </Pressable>

        {/* Account/Currency Selector */}
        <Pressable
          className="flex-1 flex-row items-center justify-between rounded-xl bg-card p-2.5 shadow-sm active:bg-muted/50"
          onPress={() => setShowAccountModal(true)}
        >
          <View className="flex-1 flex-row items-center">
            <View className="mr-2 rounded-lg bg-primary/10 p-1">
              <Icon
                name={account ? 'CreditCard' : 'DollarSign'}
                size={14}
                className="text-primary"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {account
                  ? 'Account'
                  : selectedCurrency
                    ? 'Currency'
                    : 'Account / Currency'}
              </Text>
              <Text
                className="text-sm font-semibold text-foreground"
                numberOfLines={1}
              >
                {account?.name ||
                  (selectedCurrency
                    ? `${selectedCurrency.symbol} ${selectedCurrency.code}`
                    : 'Select Account or Currency')}
              </Text>
            </View>
          </View>
          <Icon
            name="ChevronDown"
            size={14}
            className="ml-1 text-muted-foreground"
          />
        </Pressable>
      </View>

      {/* Subcategories  */}
      <SubcategorySelection
        selectedParentCategoryId={parentCategory?.id ?? ''}
        selectedCategoryId={categoryId}
        setSelectedCategoryId={categoryId =>
          router.setParams({ categoryId: categoryId })
        }
        type={type}
      />

      <Calculator
        type={type}
        isDisabled={!categoryId || (!account && !selectedCurrency)}
        handleSubmit={handleSubmit}
      />

      {/* Modals */}
      <CategoryModal
        visible={showCategoryModal}
        type={type}
        selectedCategoryId={parentCategory?.id ?? ''}
        onSelectCategory={handleParentCategorySelect}
        onClose={() => setShowCategoryModal(false)}
      />

      <AccountModal
        visible={showAccountModal}
        selectedAccountId={accountId ?? ''}
        currencies={currencies}
        selectedCurrencyCode={selectedCurrencyCode}
        onSelectCurrency={code => {
          setSelectedCurrencyCode(code)
          router.setParams({ accountId: '' })
        }}
        onSelectAccount={id => {
          router.setParams({ accountId: id })
          setSelectedCurrencyCode('')
        }}
        onClose={() => setShowAccountModal(false)}
      />
    </>
  )
}
