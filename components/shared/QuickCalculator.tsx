import { useTheme, useThemedStyles } from '@/context/ThemeContext'
import { mockCategories, mockIncomeCategories } from '@/data/mockData'
import {
  Asterisk,
  Check,
  Divide,
  DollarSign,
  Equal,
  MessageSquare,
  Minus,
  Plus,
  Save,
  Tag,
  X
} from 'lucide-react-native'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native'
import Button from '../ui/Button'

const currencies = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' }
]

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
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [comment, setComment] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [category, setCategory] = useState(initialCategory)
  const [result, setResult] = useState<string | null>(null)

  // Get appropriate categories based on type
  const categories = type === 'expense' ? mockCategories : mockIncomeCategories
  const modalTitle =
    type === 'expense' ? 'Select Category' : 'Select Income Category'

  const styles = useThemedStyles(theme => ({
    container: {
      padding: theme.spacing.md
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: theme.spacing.xl - 8
    },
    headerButtons: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const
    },
    categoryButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm * 1.5,
      borderRadius: theme.borderRadius.sm
    },
    categoryText: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: theme.colors.text
    },
    display: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md * 1.5,
      marginBottom: theme.spacing.xl - 8,
      backgroundColor: theme.colors.card,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4
        },
        android: {
          elevation: 2
        },
        web: {
          boxShadow: `0px 2px 4px ${theme.colors.shadow}`
        }
      })
    },
    displayText: {
      fontSize: 36,
      fontWeight: '700' as const,
      textAlign: 'right' as const,
      color: theme.colors.text
    },
    commentPreview: {
      fontSize: 12,
      marginTop: theme.spacing.sm,
      textAlign: 'right' as const,
      color: theme.colors.textSecondary
    },
    keypad: {
      gap: theme.spacing.sm
    },
    row: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm,
      height: 60
    },
    calcButton: {
      flex: 1,
      borderRadius: theme.borderRadius.md * 1.5,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      height: '100%' as const,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadowLight,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4
        },
        android: {
          elevation: 2
        },
        web: {
          boxShadow: `0px 2px 4px ${theme.colors.shadowLight}`
        }
      })
    },
    calcButtonText: {
      fontSize: 20,
      fontWeight: '600' as const
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      backgroundColor: theme.colors.shadow,
      padding: theme.spacing.md
    },
    modalContent: {
      borderRadius: theme.borderRadius.md * 2,
      padding: theme.spacing.md,
      maxHeight: '80%' as const,
      backgroundColor: theme.colors.card
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      marginBottom: theme.spacing.md,
      color: theme.colors.text
    },
    commentInput: {
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm * 1.5,
      minHeight: 100,
      textAlignVertical: 'top' as const,
      marginBottom: theme.spacing.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border
    },
    modalButtons: {
      flexDirection: 'row' as const
    },
    currencyList: {
      maxHeight: 300
    },
    currencyOption: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.sm
    },
    currencySymbol: {
      fontSize: 24,
      fontWeight: '600' as const,
      marginRight: theme.spacing.md
    },
    currencyInfo: {
      flex: 1
    },
    currencyCode: {
      fontSize: 16,
      fontWeight: '600' as const
    },
    currencyName: {
      fontSize: 14
    },
    categoryList: {
      maxHeight: 300
    },
    categoryOption: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.sm
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600' as const
    }
  }))

  const getDisplayExpression = () => {
    if (result !== null) {
      return result
    }
    return (
      [...expression, isNewNumber ? '' : currentInput].join(' ').trim() ||
      currentInput
    )
  }

  const handleNumberPress = (num: string) => {
    if (result !== null) {
      setResult(null)
      setExpression([])
      setCurrentInput(num)
      setIsNewNumber(false)
    } else if (isNewNumber) {
      setCurrentInput(num)
      setIsNewNumber(false)
    } else {
      setCurrentInput(currentInput + num)
    }
  }

  const handleOperationPress = (op: string) => {
    if (result !== null) {
      setExpression([result, op])
      setResult(null)
    } else {
      setExpression([...expression, currentInput, op])
    }
    setIsNewNumber(true)
  }

  const handleParentheses = (paren: '(' | ')') => {
    const openCount = expression.filter(x => x === '(').length
    const closeCount = expression.filter(x => x === ')').length

    if (paren === '(') {
      if (expression.length === 0 && !isNewNumber && currentInput !== '0') {
        setExpression(['('])
        setCurrentInput(currentInput)
        setIsNewNumber(false)
      } else if (!isNewNumber && currentInput !== '0') {
        setExpression([...expression, currentInput, '*', '('])
        setIsNewNumber(true)
      } else {
        setExpression([...expression, '('])
        setIsNewNumber(true)
      }
    } else if (paren === ')' && openCount > closeCount && !isNewNumber) {
      setExpression([...expression, currentInput, ')'])
      setIsNewNumber(true)
    }
  }

  const evaluateExpression = (exp: string[]): number => {
    const precedence = {
      '*': 2,
      '/': 2,
      '+': 1,
      '-': 1
    }

    const output: string[] = []
    const operators: string[] = []

    exp.forEach(token => {
      if (!isNaN(Number(token))) {
        output.push(token)
      } else if (token === '(') {
        operators.push(token)
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          output.push(operators.pop()!)
        }
        operators.pop()
      } else {
        while (
          operators.length &&
          operators[operators.length - 1] !== '(' &&
          precedence[
            operators[operators.length - 1] as keyof typeof precedence
          ] >= precedence[token as keyof typeof precedence]
        ) {
          output.push(operators.pop()!)
        }
        operators.push(token)
      }
    })

    while (operators.length) {
      output.push(operators.pop()!)
    }

    const stack: number[] = []
    output.forEach(token => {
      if (!isNaN(Number(token))) {
        stack.push(Number(token))
      } else {
        const b = stack.pop()!
        const a = stack.pop()!
        switch (token) {
          case '+':
            stack.push(a + b)
            break
          case '-':
            stack.push(a - b)
            break
          case '*':
            stack.push(a * b)
            break
          case '/':
            stack.push(a / b)
            break
        }
      }
    })

    return stack[0]
  }

  const handleEquals = () => {
    if (expression.length === 0 && result === null) {
      return
    }

    let finalExpression = [...expression]
    if (!isNewNumber) {
      finalExpression.push(currentInput)
    }

    const openCount = finalExpression.filter(x => x === '(').length
    const closeCount = finalExpression.filter(x => x === ')').length
    for (let i = 0; i < openCount - closeCount; i++) {
      finalExpression.push(')')
    }

    const calculatedResult = evaluateExpression(finalExpression)
    setResult(calculatedResult.toString())
    setCurrentInput(calculatedResult.toString())
    setExpression([])
    setIsNewNumber(true)
  }

  const handleClear = () => {
    setCurrentInput('0')
    setExpression([])
    setIsNewNumber(true)
    setResult(null)
  }

  const handleDecimal = () => {
    if (!currentInput.includes('.')) {
      setCurrentInput(currentInput + '.')
      setIsNewNumber(false)
    }
  }

  const handleSubmit = () => {
    onSubmit({
      amount: parseFloat(currentInput),
      category,
      comment
    })
  }

  const CalcButton = ({
    label,
    onPress,
    variant = 'default',
    size = 1
  }: {
    label: string | React.ReactNode
    onPress: () => void
    variant?: 'default' | 'operation' | 'equal' | 'special'
    size?: number
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.calcButton,
        {
          backgroundColor:
            variant === 'operation'
              ? colors.primary
              : variant === 'equal'
                ? colors.success
                : variant === 'special'
                  ? colors.warning
                  : colors.surfaceSecondary,
          opacity: pressed ? 0.8 : 1,
          flex: size
        }
      ]}
    >
      {typeof label === 'string' ? (
        <Text
          style={[
            styles.calcButtonText,
            {
              color:
                variant === 'operation' || variant === 'equal'
                  ? colors.button.primaryText
                  : variant === 'special'
                    ? colors.button.primaryText
                    : colors.text,
              fontSize: variant === 'equal' ? 20 : 24
            }
          ]}
        >
          {label}
        </Text>
      ) : (
        label
      )}
    </Pressable>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setShowCategoryModal(true)}
          style={styles.categoryButton}
        >
          <Text style={styles.categoryText}>{category}</Text>
          <Tag size={16} color={colors.text} style={{ marginLeft: 8 }} />
        </Pressable>
        <View style={styles.headerButtons}>
          <Button
            variant="ghost"
            onPress={() => setShowCommentModal(true)}
            leftIcon={<MessageSquare size={20} color={colors.text} />}
            style={{ marginRight: 8 }}
          >
            {''}
          </Button>
          <Button
            variant="ghost"
            onPress={onClose}
            leftIcon={<X size={20} color={colors.text} />}
          >
            {''}
          </Button>
        </View>
      </View>

      <View style={styles.display}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {getDisplayExpression()}
        </Text>
        {comment && <Text style={styles.commentPreview}>{comment}</Text>}
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          <CalcButton label="C" onPress={handleClear} variant="special" />
          <CalcButton label="(" onPress={() => handleParentheses('(')} />
          <CalcButton label=")" onPress={() => handleParentheses(')')} />
          <CalcButton
            label={<DollarSign size={20} color={colors.text} />}
            onPress={() => setShowCurrencyModal(true)}
          />
          <CalcButton
            label={<Divide size={20} color={colors.button.primaryText} />}
            onPress={() => handleOperationPress('/')}
            variant="operation"
          />
        </View>
        <View style={styles.row}>
          <CalcButton label="7" onPress={() => handleNumberPress('7')} />
          <CalcButton label="8" onPress={() => handleNumberPress('8')} />
          <CalcButton label="9" onPress={() => handleNumberPress('9')} />
          <CalcButton
            label={<Asterisk size={20} color={colors.button.primaryText} />}
            onPress={() => handleOperationPress('*')}
            variant="operation"
          />
          <CalcButton
            label={<Plus size={24} color={colors.button.primaryText} />}
            onPress={() => handleOperationPress('+')}
            variant="operation"
          />
        </View>
        <View style={styles.row}>
          <CalcButton label="4" onPress={() => handleNumberPress('4')} />
          <CalcButton label="5" onPress={() => handleNumberPress('5')} />
          <CalcButton label="6" onPress={() => handleNumberPress('6')} />
          <CalcButton
            label={
              <MessageSquare size={20} color={colors.button.primaryText} />
            }
            onPress={() => setShowCommentModal(true)}
            variant="operation"
          />
          <CalcButton
            label={<Minus size={24} color={colors.button.primaryText} />}
            onPress={() => handleOperationPress('-')}
            variant="operation"
          />
        </View>
        <View style={styles.row}>
          <CalcButton label="1" onPress={() => handleNumberPress('1')} />
          <CalcButton label="2" onPress={() => handleNumberPress('2')} />
          <CalcButton label="3" onPress={() => handleNumberPress('3')} />
          <CalcButton
            label={<Equal size={24} color={colors.button.primaryText} />}
            onPress={handleEquals}
            variant="operation"
            size={2}
          />
        </View>
        <View style={styles.row}>
          <CalcButton
            label="0"
            onPress={() => handleNumberPress('0')}
            size={2}
          />
          <CalcButton
            label={
              <Text style={[styles.calcButtonText, { color: colors.text }]}>
                .
              </Text>
            }
            onPress={handleDecimal}
          />
          <CalcButton
            label={<Save size={24} color={colors.button.primaryText} />}
            onPress={handleSubmit}
            variant="equal"
            size={2}
          />
        </View>
      </View>

      <Modal
        visible={showCommentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCommentModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Comment</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Enter comment..."
              placeholderTextColor={colors.textSecondary}
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                onPress={() => setShowCommentModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => setShowCommentModal(false)}
                style={{ flex: 1 }}
                leftIcon={<Check size={20} color={colors.button.primaryText} />}
              >
                Done
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showCurrencyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView style={styles.currencyList}>
              {currencies.map(currency => (
                <Pressable
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    {
                      backgroundColor:
                        selectedCurrency.code === currency.code
                          ? colors.primary
                          : 'transparent'
                    }
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency)
                    setShowCurrencyModal(false)
                  }}
                >
                  <Text
                    style={[
                      styles.currencySymbol,
                      {
                        color:
                          selectedCurrency.code === currency.code
                            ? colors.button.primaryText
                            : colors.text
                      }
                    ]}
                  >
                    {currency.symbol}
                  </Text>
                  <View style={styles.currencyInfo}>
                    <Text
                      style={[
                        styles.currencyCode,
                        {
                          color:
                            selectedCurrency.code === currency.code
                              ? colors.button.primaryText
                              : colors.text
                        }
                      ]}
                    >
                      {currency.code}
                    </Text>
                    <Text
                      style={[
                        styles.currencyName,
                        {
                          color:
                            selectedCurrency.code === currency.code
                              ? colors.button.primaryText
                              : colors.textSecondary
                        }
                      ]}
                    >
                      {currency.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <ScrollView style={styles.categoryList}>
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor:
                        category === cat.name ? colors.primary : 'transparent'
                    }
                  ]}
                  onPress={() => {
                    setCategory(cat.name)
                    setShowCategoryModal(false)
                  }}
                >
                  <Text
                    style={[
                      styles.categoryName,
                      {
                        color:
                          category === cat.name
                            ? colors.button.primaryText
                            : colors.text
                      }
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}
