import { Text } from '@/components/ui/text'
import { useUserSession } from '@/lib/hooks'
import { ChevronDown, CreditCard, Tag } from '@/lib/icons'
import { createTransaction } from '@/lib/powersync/data/mutations'
import { useGetAccounts, useGetCategories } from '@/lib/powersync/data/queries'
import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Calculator } from '../calculator'
import { AccountModal } from './modal-account-select'
import { CategoryModal } from './modal-category-select'
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

  const selectedParentCategory = parentCategories.find(
    cat => cat.id === selectedParentCategoryId
  )
  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId)

  // Auto-select first payment account if none selected
  React.useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id)
    }
  }, [selectedAccountId, accounts])

  const handleParentCategorySelect = (categoryId: string) => {
    setSelectedParentCategoryId(categoryId)
    // Set the parent category as selected by default
    // If subcategories exist, the user can select one to override this
    setSelectedCategoryId(categoryId)
  }

  const handleSubmit = async (amount: number, comment: string) => {
    if (amount > 0 && selectedAccount && selectedCategoryId && userId) {
      setIsSubmitting(true)
      try {
        const [error] = await createTransaction({
          userId,
          data: {
            type,
            accountId: selectedAccount.id,
            categoryId: selectedCategoryId,
            amount: amount,
            currencyId: selectedAccount.currencyId,
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
                <Tag size={16} className="text-primary" />
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
            <ChevronDown size={16} className="ml-1 text-muted-foreground" />
          </Pressable>

          {/* Account Selector */}
          <Pressable
            className="flex-1 flex-row items-center justify-between rounded-xl bg-card p-3 shadow-sm active:bg-muted/50"
            onPress={() => setShowAccountModal(true)}
          >
            <View className="flex-1 flex-row items-center">
              <View className="mr-2 rounded-lg bg-primary/10 p-1.5">
                <CreditCard size={16} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Account
                </Text>
                <Text
                  className="text-sm font-semibold text-foreground"
                  numberOfLines={1}
                >
                  {selectedAccount?.name || 'Select Account'}
                </Text>
              </View>
            </View>
            <ChevronDown size={16} className="ml-1 text-muted-foreground" />
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
        isDisabled={isSubmitting || !selectedAccount || !selectedCategoryId}
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
        onSelectAccount={setSelectedAccountId}
        onClose={() => setShowAccountModal(false)}
      />
    </View>
  )
}
