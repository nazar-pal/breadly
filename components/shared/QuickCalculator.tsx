import { useAccounts } from '@/components/accounts/lib/useAccounts'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useTransactions } from '@/hooks/useTransactions'
import { Check, MessageSquare, Save } from '@/lib/icons'
import { useGetCategories } from '@/powersync/data/queries'
import React, { useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View
} from 'react-native'

interface QuickCalculatorProps {
  userId: string
  type: 'expense' | 'income'
  categoryId: string
  onSubmit: () => void
  onClose: () => void
}

export default function QuickCalculator({
  userId,
  type,
  categoryId: initialCategoryId,
  onSubmit,
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

  // Hooks
  const { data: categories } = useGetCategories({
    userId,
    type: 'expense'
  })
  const { accounts, paymentAccounts } = useAccounts()
  const { createTransaction } = useTransactions()

  // Filter categories by type
  const availableCategories = categories.filter(cat => cat.type === type)

  // Find selected category and account
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId)
  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId)

  // Auto-select first payment account if none selected
  React.useEffect(() => {
    if (!selectedAccountId && paymentAccounts.length > 0) {
      setSelectedAccountId(paymentAccounts[0].id)
    }
  }, [selectedAccountId, paymentAccounts])

  const getDisplayExpression = () => {
    if (expression.length === 0) return currentInput
    return (
      expression.join(' ') + (currentInput !== '0' ? ` ${currentInput}` : '')
    )
  }

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

  const evaluateExpression = (exp: string[]): number => {
    // Simple evaluation logic (would need proper implementation)
    try {
      const evalString = exp.join(' ')
      // Basic safety check - only allow numbers and basic operators
      if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(evalString)) {
        throw new Error('Invalid expression')
      }
      // Note: In production, use a proper math expression parser
      return Function(`"use strict"; return (${evalString})`)()
    } catch {
      return 0
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
        // Create the transaction
        await createTransaction({
          type,
          accountId: selectedAccount.id,
          categoryId: selectedCategory.id,
          amount: amount,
          currencyId: selectedAccount.currencyId,
          txDate: new Date(), // Today's date
          notes: comment || undefined
        })

        onSubmit()
        onClose()
      } catch (error) {
        console.error('Failed to create transaction:', error)
        // Error is already handled in the hook with Alert.alert
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const CalcButton = ({
    label,
    onPress,
    variant = 'default',
    isWide = false
  }: {
    label: string | React.ReactNode
    onPress: () => void
    variant?: 'default' | 'operation' | 'equal' | 'special'
    isWide?: boolean
  }) => {
    const getButtonStyle = () => {
      const baseStyle = Platform.select({
        android: { elevation: 2 },
        default: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }
      })

      let backgroundColor = '#FFFFFF' // colors.card
      if (variant === 'operation') {
        backgroundColor = 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
      } else if (variant === 'equal') {
        backgroundColor = '#6366F1' // colors.primary
      } else if (variant === 'special') {
        backgroundColor = 'rgba(245, 158, 11, 0.1)' // colors.iconBackground.warning
      }

      return { ...baseStyle, backgroundColor }
    }

    const getTextColor = () => {
      if (variant === 'equal') {
        return '#FFFFFF' // colors.textInverse
      } else if (variant === 'operation' || variant === 'special') {
        return '#6366F1' // colors.primary
      }
      return '#1A202C' // colors.text
    }

    return (
      <Pressable
        className={`h-[60px] items-center justify-center rounded-2xl ${isWide ? 'flex-[2]' : 'flex-1'}`}
        style={getButtonStyle()}
        onPress={onPress}
      >
        <Text
          className="text-xl font-semibold"
          style={{ color: getTextColor() }}
        >
          {label}
        </Text>
      </Pressable>
    )
  }

  return (
    <View className="p-4">
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Pressable
            className="bg-card-secondary flex-row items-center rounded px-3 py-2"
            onPress={() => setShowCategoryModal(true)}
          >
            <Text className="text-lg font-semibold text-foreground">
              {selectedCategory?.name || 'Select Category'}
            </Text>
          </Pressable>
          <Pressable
            className="bg-card-secondary flex-row items-center rounded px-3 py-2"
            onPress={() => setShowAccountModal(true)}
          >
            <Text className="text-sm font-medium text-foreground">
              {selectedAccount?.name || 'Select Account'}
            </Text>
          </Pressable>
        </View>
        <View className="flex-row items-center">
          <Pressable onPress={() => setShowCommentModal(true)}>
            <MessageSquare size={24} color="#4A5568" />
          </Pressable>
        </View>
      </View>

      {/* Display */}
      <View
        className="mb-6 rounded-2xl bg-card p-4"
        style={Platform.select({
          android: { elevation: 2 },
          default: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }
        })}
      >
        <Text className="text-right text-4xl font-bold text-foreground">
          ${getDisplayExpression()}
        </Text>
        {comment && (
          <Text className="mt-2 text-right text-xs text-foreground">
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
      <View className="mt-6">
        <Button
          onPress={handleSubmit}
          variant="default"
          size="lg"
          className="w-full"
          disabled={isSubmitting || !selectedAccount || !selectedCategory}
        >
          <Save size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text>
            {isSubmitting
              ? 'Saving...'
              : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
          </Text>
        </Button>
      </View>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View
          className="flex-1 justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <View className="max-h-[80%] rounded-2xl bg-card p-4">
            <Text className="mb-4 text-xl font-semibold text-foreground">
              Select {type === 'expense' ? 'Expense' : 'Income'} Category
            </Text>
            <ScrollView>
              {availableCategories.map(cat => (
                <Pressable
                  key={cat.id}
                  className="my-1 rounded-lg p-4"
                  style={{
                    backgroundColor:
                      cat.id === selectedCategoryId
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'transparent'
                  }}
                  onPress={() => {
                    setSelectedCategoryId(cat.id)
                    setShowCategoryModal(false)
                  }}
                >
                  <Text className="text-base font-medium text-foreground">
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View className="mt-4 flex-row">
              <Button
                onPress={() => setShowCategoryModal(false)}
                variant="outline"
                className="w-full"
              >
                <Text>Close</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Account Modal */}
      <Modal
        visible={showAccountModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View
          className="flex-1 justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <View className="max-h-[80%] rounded-2xl bg-card p-4">
            <Text className="mb-4 text-xl font-semibold text-foreground">
              Select Account
            </Text>
            <ScrollView>
              {paymentAccounts.map(account => (
                <Pressable
                  key={account.id}
                  className="my-1 rounded-lg p-4"
                  style={{
                    backgroundColor:
                      account.id === selectedAccountId
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'transparent'
                  }}
                  onPress={() => {
                    setSelectedAccountId(account.id)
                    setShowAccountModal(false)
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-medium text-foreground">
                      {account.name}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      ${account.balance.toFixed(2)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <View className="mt-4 flex-row">
              <Button
                onPress={() => setShowAccountModal(false)}
                variant="outline"
                className="w-full"
              >
                <Text>Close</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCommentModal(false)}
      >
        <View
          className="flex-1 justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <View className="max-h-[80%] rounded-2xl bg-card p-4">
            <Text className="mb-4 text-xl font-semibold text-foreground">
              Add Comment
            </Text>
            <TextInput
              className="mb-4 min-h-[100px] rounded-lg border border-border bg-background p-3 text-foreground"
              value={comment}
              onChangeText={setComment}
              placeholder="Add a comment..."
              placeholderTextColor="#4A5568"
              multiline
              textAlignVertical="top"
            />
            <View className="flex-row gap-3">
              <Button
                onPress={() => setShowCommentModal(false)}
                variant="outline"
                className="flex-[0.4]"
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                onPress={() => setShowCommentModal(false)}
                variant="default"
                className="flex-[0.6]"
              >
                <Check size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text>Save</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
