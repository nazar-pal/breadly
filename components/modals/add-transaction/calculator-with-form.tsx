import { Calculator } from '@/components/calculator'
import { Icon } from '@/components/icon'
import { Text } from '@/components/ui/text'
import { createTransaction } from '@/data/client/mutations'
import {
  useGetAccounts,
  useGetCategories,
  useGetCurrencies
} from '@/data/client/queries'
import { useUserSession } from '@/modules/session-and-migration'
import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { AccountModal } from './inner-modals/modal-account-select'
import { CategoryModal } from './inner-modals/modal-category-select'
import { SubcategorySelection } from './subcategory-selection'

interface Props {
  type: 'expense' | 'income'
  categoryId: string
  onClose: () => void
}

export function CalculatorWithForm({
  type,
  categoryId: initialCategoryId,
  onClose
}: Props) {
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId)
  const [selectedParentCategoryId, setSelectedParentCategoryId] =
    useState<string>(initialCategoryId)
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userId } = useUserSession()

  // Get parent categories for modal selection
  const { data: parentCategories = [] } = useGetCategories({
    userId,
    type,
    parentId: null // Only parent categories
  })

  const { data: accounts = [] } = useGetAccounts({
    userId,
    accountType: 'payment'
  })

  const { data: currencies = [] } = useGetCurrencies()

  const selectedParentCategory = parentCategories.find(
    cat => cat.id === selectedParentCategoryId
  )
  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId)
  const selectedCurrency = currencies.find(c => c.code === selectedCurrencyCode)

  const handleParentCategorySelect = (categoryId: string) => {
    setSelectedParentCategoryId(categoryId)
    // Set the parent category as selected by default
    // If subcategories exist, the user can select one to override this
    setSelectedCategoryId(categoryId)
  }

  const handleSubmit = async (amount: number, comment: string) => {
    const hasMoneySource = Boolean(selectedAccount) || Boolean(selectedCurrency)
    if (amount > 0 && hasMoneySource && selectedCategoryId && userId) {
      setIsSubmitting(true)
      try {
        const [error] = await createTransaction({
          userId,
          data: {
            type,
            ...(selectedAccount ? { accountId: selectedAccount.id } : {}),
            categoryId: selectedCategoryId,
            amount: amount,
            currencyId: selectedAccount
              ? selectedAccount.currencyId
              : selectedCurrencyCode,
            txDate: new Date(),
            notes: comment || null,
            createdAt: new Date()
          }
        })

        if (error) {
          console.error('Failed to create transaction:', error)
          throw error
        }

        onClose()
      } catch (error) {
        console.error('Failed to create transaction:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <View className="bg-secondary p-4">
      {/* Header */}
      <View className="mb-2">
        {/* Category and Account Selection */}
        <View className="mb-4 flex-row gap-2">
          {/* Category Selector */}
          <Pressable
            className="flex-1 flex-row items-center justify-between rounded-xl bg-card p-3 shadow-sm active:bg-muted/50"
            onPress={() => setShowCategoryModal(true)}
          >
            <View className="flex-1 flex-row items-center">
              <View className="mr-2 rounded-lg bg-primary/10 p-1.5">
                <Icon name="Tag" size={16} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Category
                </Text>
                <Text
                  className="text-sm font-semibold text-foreground"
                  numberOfLines={1}
                >
                  {selectedParentCategory?.name || 'Select Category'}
                </Text>
              </View>
            </View>
            <Icon
              name="ChevronDown"
              size={16}
              className="ml-1 text-muted-foreground"
            />
          </Pressable>

          {/* Account/Currency Selector */}
          <Pressable
            className="flex-1 flex-row items-center justify-between rounded-xl bg-card p-3 shadow-sm active:bg-muted/50"
            onPress={() => setShowAccountModal(true)}
          >
            <View className="flex-1 flex-row items-center">
              <View className="mr-2 rounded-lg bg-primary/10 p-1.5">
                <Icon
                  name={selectedAccount ? 'CreditCard' : 'DollarSign'}
                  size={16}
                  className="text-primary"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {selectedAccount
                    ? 'Account'
                    : selectedCurrency
                      ? 'Currency'
                      : 'Account / Currency'}
                </Text>
                <Text
                  className="text-sm font-semibold text-foreground"
                  numberOfLines={1}
                >
                  {selectedAccount?.name ||
                    (selectedCurrency
                      ? `${selectedCurrency.symbol} ${selectedCurrency.code}`
                      : 'Select Account or Currency')}
                </Text>
              </View>
            </View>
            <Icon
              name="ChevronDown"
              size={16}
              className="ml-1 text-muted-foreground"
            />
          </Pressable>
        </View>

        {/* Subcategories  */}
        <SubcategorySelection
          selectedParentCategoryId={selectedParentCategoryId}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          type={type}
        />
      </View>

      <Calculator
        type={type}
        isDisabled={
          isSubmitting ||
          !selectedCategoryId ||
          (!selectedAccount && !selectedCurrency)
        }
        handleSubmit={handleSubmit}
      />

      {/* Modals */}
      <CategoryModal
        visible={showCategoryModal}
        type={type}
        categories={parentCategories}
        selectedCategoryId={selectedParentCategoryId}
        onSelectCategory={handleParentCategorySelect}
        onClose={() => setShowCategoryModal(false)}
      />

      <AccountModal
        visible={showAccountModal}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        currencies={currencies}
        selectedCurrencyCode={selectedCurrencyCode}
        onSelectCurrency={code => {
          setSelectedCurrencyCode(code)
          setSelectedAccountId('')
        }}
        onSelectAccount={id => {
          setSelectedAccountId(id)
          setSelectedCurrencyCode('')
        }}
        onClose={() => setShowAccountModal(false)}
      />
    </View>
  )
}
