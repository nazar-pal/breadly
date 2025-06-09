import { useTheme, useThemedStyles } from '@/context/ThemeContext'
import { mockCategories, mockIncomeCategories } from '@/data/mockData'
import { Check, MessageSquare, Save } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native'
import Button from '../ui/Button'

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
  const { colors } = useTheme()
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

  const styles = useThemedStyles(theme => ({
    display: {
      backgroundColor: theme.colors.card,
      ...Platform.select({
        android: {
          elevation: 2
        },
        default: {
          boxShadow: `0px 2px 4px ${theme.colors.shadow}`
        }
      })
    },
    calcButton: {
      ...Platform.select({
        android: {
          elevation: 2
        },
        default: {
          boxShadow: `0px 2px 4px ${theme.colors.shadowLight}`
        }
      })
    },
    modalContainer: {
      backgroundColor: theme.colors.shadow
    },
    modalContent: {
      backgroundColor: theme.colors.card
    },
    commentInput: {
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border
    },
    currencyOption: {
      backgroundColor: 'transparent'
    }
  }))

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
  }) => (
    <Pressable
      className={`h-[60px] items-center justify-center rounded-2xl ${isWide ? 'flex-[2]' : 'flex-1'}`}
      style={[
        styles.calcButton,
        {
          backgroundColor:
            variant === 'operation'
              ? colors.iconBackground.primary
              : variant === 'equal'
                ? colors.primary
                : variant === 'special'
                  ? colors.iconBackground.warning
                  : colors.card
        }
      ]}
      onPress={onPress}
    >
      <Text
        className="text-xl font-semibold"
        style={{
          color:
            variant === 'equal'
              ? colors.textInverse
              : variant === 'operation' || variant === 'special'
                ? colors.primary
                : colors.text
        }}
      >
        {label}
      </Text>
    </Pressable>
  )

  return (
    <View className="p-4">
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable
            className="flex-row items-center rounded px-3 py-2"
            style={{ backgroundColor: colors.surfaceSecondary }}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text
              className="text-2xl font-semibold"
              style={{ color: colors.text }}
            >
              {category}
            </Text>
          </Pressable>
        </View>
        <View className="flex-row items-center">
          <Pressable onPress={() => setShowCommentModal(true)}>
            <MessageSquare size={24} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Display */}
      <View className="mb-6 rounded-2xl p-4" style={styles.display}>
        <Text
          className="text-right text-4xl font-bold"
          style={{ color: colors.text }}
        >
          ${getDisplayExpression()}
        </Text>
        {comment && (
          <Text
            className="mt-2 text-right text-xs"
            style={{ color: colors.textSecondary }}
          >
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
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Save size={20} color={colors.textInverse} />}
        >
          Save {type === 'expense' ? 'Expense' : 'Income'}
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
          style={styles.modalContainer}
        >
          <View
            className="max-h-[80%] rounded-2xl p-4"
            style={styles.modalContent}
          >
            <Text
              className="mb-4 text-xl font-semibold"
              style={{ color: colors.text }}
            >
              {modalTitle}
            </Text>
            <ScrollView>
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  className="my-1 rounded-lg p-4"
                  style={[
                    styles.currencyOption,
                    {
                      backgroundColor:
                        cat.name === category
                          ? colors.iconBackground.primary
                          : 'transparent'
                    }
                  ]}
                  onPress={() => {
                    setCategory(cat.name)
                    setShowCategoryModal(false)
                  }}
                >
                  <Text
                    className="text-base font-medium"
                    style={{ color: colors.text }}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View className="mt-4 flex-row">
              <Button
                onPress={() => setShowCategoryModal(false)}
                variant="outline"
                fullWidth
              >
                Close
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
          style={styles.modalContainer}
        >
          <View
            className="max-h-[80%] rounded-2xl p-4"
            style={styles.modalContent}
          >
            <Text
              className="mb-4 text-xl font-semibold"
              style={{ color: colors.text }}
            >
              Add Comment
            </Text>
            <TextInput
              className="mb-4 min-h-[100px] rounded-lg border p-3"
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
            <View className="flex-row gap-3">
              <Button
                onPress={() => setShowCommentModal(false)}
                variant="outline"
                className="flex-[0.4]"
              >
                Cancel
              </Button>
              <Button
                onPress={() => setShowCommentModal(false)}
                variant="primary"
                className="flex-[0.6]"
                leftIcon={<Check size={16} color={colors.textInverse} />}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
