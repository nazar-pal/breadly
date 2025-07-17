import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useUserSession } from '@/lib/hooks'
import { ChevronDown, CreditCard, MessageSquare, Save, Tag } from '@/lib/icons'
import { createTransaction } from '@/lib/powersync/data/mutations'
import { useGetAccounts, useGetCategories } from '@/lib/powersync/data/queries'
import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { AccountModal } from './account-modal'
import { CalcButton } from './calc-button'
import { CategoryModal } from './category-modal'
import { CommentModal } from './comment-modal'
import { SubcategorySelection } from './subcategory-selection'
import { QuickCalculatorProps } from './types'
import { evaluateExpression, getDisplayExpression } from './utils'

export function QuickCalculator({
  type,
  categoryId: initialCategoryId,
  onClose
}: QuickCalculatorProps) {
  const [currentInput, setCurrentInput] = useState('0')
  const [expression, setExpression] = useState<string[]>([])
  const [isNewNumber, setIsNewNumber] = useState(true)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [comment, setComment] = useState('')
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

  const handleNumberPress = (num: string) => {
    if (isNewNumber) {
      setCurrentInput(num)
      setIsNewNumber(false)
    } else {
      if (currentInput === '0' && num !== '.') {
        setCurrentInput(num)
      } else {
        setCurrentInput(currentInput + num)
      }
    }
  }

  const handleOperationPress = (op: string) => {
    setExpression([...expression, currentInput, op])
    setCurrentInput('0')
    setIsNewNumber(true)
  }

  const handleParentheses = (paren: '(' | ')') => {
    if (paren === '(') {
      if (currentInput === '0' || isNewNumber) {
        setExpression([...expression, '('])
      } else {
        setExpression([...expression, currentInput, '*', '('])
        setCurrentInput('0')
        setIsNewNumber(true)
      }
    } else {
      if (currentInput !== '0') {
        setExpression([...expression, currentInput, ')'])
        setCurrentInput('0')
        setIsNewNumber(true)
      } else {
        setExpression([...expression, ')'])
      }
    }
  }

  const handleEquals = () => {
    if (expression.length > 0) {
      const fullExpression = [...expression, currentInput]
      const resultValue = evaluateExpression(fullExpression)
      setCurrentInput(resultValue.toString())
      setExpression([])
      setIsNewNumber(true)
    }
  }

  const handleClear = () => {
    setCurrentInput('0')
    setExpression([])
    setIsNewNumber(true)
  }

  const handleDecimal = () => {
    if (!currentInput.includes('.')) {
      setCurrentInput(currentInput + '.')
      setIsNewNumber(false)
    }
  }

  const handleParentCategorySelect = (categoryId: string) => {
    setSelectedParentCategoryId(categoryId)
    // Set the parent category as selected by default
    // If subcategories exist, the user can select one to override this
    setSelectedCategoryId(categoryId)
  }

  const handleSubmit = async () => {
    const amount = parseFloat(currentInput)
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
      <View className="mb-6">
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

        {/* Subcategories and Add Note Row */}

        <View className="flex-row items-center justify-between">
          {/* Subcategory Badges - Scrollable */}
          <SubcategorySelection
            selectedParentCategoryId={selectedParentCategoryId}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            type={type}
          />

          {/* Add Note Button */}
          <Pressable
            onPress={() => setShowCommentModal(true)}
            className="ml-auto flex-row items-center rounded-lg bg-card px-3 py-2 active:bg-muted/50"
          >
            <MessageSquare size={18} className="mr-2 text-muted-foreground" />
            <Text className="text-sm font-medium text-muted-foreground">
              {comment ? 'Edit Note' : 'Add Note'}
            </Text>
            {comment && (
              <View className="ml-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Display */}
      <View className="mb-6 rounded-2xl bg-card p-4 shadow-sm">
        <Text className="text-right text-4xl font-bold text-foreground">
          ${getDisplayExpression(expression, currentInput)}
        </Text>
        {comment && (
          <Text className="mt-2 text-right text-xs text-muted-foreground">
            {comment}
          </Text>
        )}
      </View>

      {/* Keypad */}
      <View className="gap-2">
        <View className="flex-row gap-2">
          <CalcButton label="C" onPress={handleClear} variant="special" />
          <CalcButton
            label="("
            onPress={() => handleParentheses('(')}
            variant="operation"
          />
          <CalcButton
            label=")"
            onPress={() => handleParentheses(')')}
            variant="operation"
          />
          <CalcButton
            label="÷"
            onPress={() => handleOperationPress('/')}
            variant="operation"
          />
        </View>

        <View className="flex-row gap-2">
          <CalcButton label="7" onPress={() => handleNumberPress('7')} />
          <CalcButton label="8" onPress={() => handleNumberPress('8')} />
          <CalcButton label="9" onPress={() => handleNumberPress('9')} />
          <CalcButton
            label="×"
            onPress={() => handleOperationPress('*')}
            variant="operation"
          />
        </View>

        <View className="flex-row gap-2">
          <CalcButton label="4" onPress={() => handleNumberPress('4')} />
          <CalcButton label="5" onPress={() => handleNumberPress('5')} />
          <CalcButton label="6" onPress={() => handleNumberPress('6')} />
          <CalcButton
            label="−"
            onPress={() => handleOperationPress('-')}
            variant="operation"
          />
        </View>

        <View className="flex-row gap-2">
          <CalcButton label="1" onPress={() => handleNumberPress('1')} />
          <CalcButton label="2" onPress={() => handleNumberPress('2')} />
          <CalcButton label="3" onPress={() => handleNumberPress('3')} />
          <CalcButton
            label="+"
            onPress={() => handleOperationPress('+')}
            variant="operation"
          />
        </View>

        <View className="flex-row gap-2">
          <CalcButton
            label="0"
            onPress={() => handleNumberPress('0')}
            isWide={true}
          />
          <CalcButton label="." onPress={handleDecimal} />
          <CalcButton label="=" onPress={handleEquals} variant="equal" />
        </View>
      </View>

      {/* Submit Button */}

      <Button
        onPress={handleSubmit}
        variant="default"
        size="lg"
        className="mt-4 w-full flex-row items-center justify-center rounded-xl"
        disabled={isSubmitting || !selectedAccount || !selectedCategoryId}
      >
        <Save size={20} className="mr-2 text-primary-foreground" />
        <Text>
          {isSubmitting
            ? 'Saving...'
            : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
        </Text>
      </Button>

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

      <CommentModal
        visible={showCommentModal}
        comment={comment}
        onChangeComment={setComment}
        onClose={() => setShowCommentModal(false)}
      />
    </View>
  )
}
