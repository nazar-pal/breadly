import { TransactionParams } from '@/app/transaction-modal'
import { Calculator } from '@/components/calculator'
import { createTransaction } from '@/data/client/mutations'
import { useGetCurrencies } from '@/data/client/queries'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { View } from 'react-native'
import { useGetAccount } from '../lib/use-get-account'
import { useGetCategory } from '../lib/use-get-category'
import { AccountModal } from './inner-modals/modal-account-select'
import { CategoryModal } from './inner-modals/modal-category-select'
import { SelectionTrigger } from './selection-trigger'
import { SubcategorySelection } from './subcategory-selection'

interface Props {
  params: Extract<TransactionParams, { type: 'expense' | 'income' }>
  onClose: () => void
}

export function AddTransaction({ params, onClose }: Props) {
  const { userId } = useUserSession()

  const { type, categoryId, accountId, currencyCode } = params

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

  const { data: currencies = [] } = useGetCurrencies()

  const selectedCurrency = currencies.find(c => c.code === currencyCode) ?? {
    code: 'USD',
    symbol: '$',
    id: 'USD',
    name: 'United States Dollar'
  }

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
          currencyId: account ? account.currencyId : (currencyCode ?? 'USD'),
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
        <SelectionTrigger
          label="Category"
          value={parentCategory?.name || 'Select Category'}
          iconName="Tag"
          onPress={() => setShowCategoryModal(true)}
        />

        <SelectionTrigger
          label={
            account
              ? 'Account'
              : selectedCurrency
                ? 'Currency'
                : 'Account / Currency'
          }
          value={
            account?.name ||
            (selectedCurrency
              ? `${selectedCurrency.symbol} ${selectedCurrency.code}`
              : 'Select Account or Currency')
          }
          iconName={account ? 'CreditCard' : 'DollarSign'}
          onPress={() => setShowAccountModal(true)}
        />
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
        selectedCurrencyCode={currencyCode ?? 'USD'}
        onSelectCurrency={code => {
          router.setParams({ currencyCode: code, accountId: '' })
        }}
        onSelectAccount={id => {
          router.setParams({ accountId: id, currencyCode: '' })
        }}
        onClose={() => setShowAccountModal(false)}
      />
    </>
  )
}
