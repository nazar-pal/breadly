import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { mockCategories, mockIncomeCategories } from '@/data/mockData'
import { Check, MessageSquare, Save } from 'lucide-react-native'
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
  type: 'expense' | 'income'
  category: string
  onSubmit: (data: {
    amount: number
    category: string
    comment?: string
  }) => void
  onClose: () => void
}

export default function QuickCalculator({
  type,
  category: initialCategory,
  onSubmit,
  onClose
}: QuickCalculatorProps) {
  const [currentInput, setCurrentInput] = useState('0')
  const [expression, setExpression] = useState<string[]>([])
  const [isNewNumber, setIsNewNumber] = useState(true)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState(initialCategory)

  // Get appropriate categories based on type
  const categories = type === 'expense' ? mockCategories : mockIncomeCategories
  const modalTitle =
    type === 'expense' ? 'Select Category' : 'Select Income Category'

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

  const handleSubmit = () => {
    const amount = parseFloat(currentInput)
    if (amount > 0) {
      onSubmit({ amount, category, comment })
      onClose()
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
        <View className="flex-row items-center">
          <Pressable
            className="flex-row items-center rounded bg-old-surface-secondary px-3 py-2"
            onPress={() => setShowCategoryModal(true)}
          >
            <Text className="text-2xl font-semibold text-old-text">
              {category}
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
        className="mb-6 rounded-2xl bg-old-card p-4"
        style={Platform.select({
          android: { elevation: 2 },
          default: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }
        })}
      >
        <Text className="text-right text-4xl font-bold text-old-text">
          ${getDisplayExpression()}
        </Text>
        {comment && (
          <Text className="mt-2 text-right text-xs text-old-text-secondary">
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
        >
          <Save size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text>Save {type === 'expense' ? 'Expense' : 'Income'}</Text>
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
          <View className="max-h-[80%] rounded-2xl bg-old-surface p-4">
            <Text className="mb-4 text-xl font-semibold text-old-text">
              {modalTitle}
            </Text>
            <ScrollView>
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  className="my-1 rounded-lg p-4"
                  style={{
                    backgroundColor:
                      cat.name === category
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'transparent'
                  }}
                  onPress={() => {
                    setCategory(cat.name)
                    setShowCategoryModal(false)
                  }}
                >
                  <Text className="text-base font-medium text-old-text">
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
          <View className="max-h-[80%] rounded-2xl bg-old-surface p-4">
            <Text className="mb-4 text-xl font-semibold text-old-text">
              Add Comment
            </Text>
            <TextInput
              className="mb-4 min-h-[100px] rounded-lg border border-old-border bg-old-background p-3 text-old-text"
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
