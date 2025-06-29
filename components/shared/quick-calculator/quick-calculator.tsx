import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useUserSession } from '@/lib/context/user-context'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { MessageSquare, Save } from '@/lib/icons'
import { useGetAccounts, useGetCategories } from '@/lib/powersync/data/queries'
import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { AccountModal } from './account-modal'
import { CalcButton } from './calc-button'
import { CategoryModal } from './category-modal'
import { CommentModal } from './comment-modal'
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
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userId } = useUserSession()

  // Hooks
  const { data: categories = [] } = useGetCategories({
    userId,
    type: 'expense'
  })
  const { data: accounts = [] } = useGetAccounts({
    userId,
    accountType: 'payment'
  })
  const { createTransaction } = useTransactions()

  // Find selected category and account
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId)
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

  const handleSubmit = async () => {
    const amount = parseFloat(currentInput)
    if (amount > 0 && selectedAccount && selectedCategory) {
      setIsSubmitting(true)
      try {
        await createTransaction({
          type,
          accountId: selectedAccount.id,
          categoryId: selectedCategory.id,
          amount: amount,
          currencyId: selectedAccount.currencyId,
          txDate: new Date(),
          notes: comment || undefined
        })

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
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Pressable
            className="rounded bg-card px-3 py-2 active:bg-muted"
            onPress={() => setShowCategoryModal(true)}
          >
            <Text className="text-lg font-semibold text-foreground">
              {selectedCategory?.name || 'Select Category'}
            </Text>
          </Pressable>
          <Pressable
            className="rounded bg-card px-3 py-2 active:bg-muted"
            onPress={() => setShowAccountModal(true)}
          >
            <Text className="text-sm font-medium text-foreground">
              {selectedAccount?.name || 'Select Account'}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => setShowCommentModal(true)}
          className="p-2 active:opacity-70"
        >
          <MessageSquare size={24} className="text-muted-foreground" />
        </Pressable>
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
        disabled={isSubmitting || !selectedAccount || !selectedCategory}
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
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
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
