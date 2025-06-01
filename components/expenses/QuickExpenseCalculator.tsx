import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '../ui/Button';
import {
  X,
  Plus,
  Minus,
  Equal,
  Save,
  MessageSquare,
  Divide,
  Asterisk,
  Check,
  DollarSign,
  Tag,
} from 'lucide-react-native';
import { mockCategories } from '@/data/mockData';

const currencies = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
];

interface QuickExpenseCalculatorProps {
  category: string;
  onSubmit: (data: { amount: number; category: string; comment?: string }) => void;
  onClose: () => void;
}

export default function QuickExpenseCalculator({
  category: initialCategory,
  onSubmit,
  onClose,
}: QuickExpenseCalculatorProps) {
  const { colors } = useTheme();
  const [currentInput, setCurrentInput] = useState('0');
  const [expression, setExpression] = useState<string[]>([]);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [category, setCategory] = useState(initialCategory);
  const [result, setResult] = useState<string | null>(null);

  const getDisplayExpression = () => {
    if (result !== null) {
      return result;
    }
    return [...expression, isNewNumber ? '' : currentInput].join(' ').trim() || currentInput;
  };

  const handleNumberPress = (num: string) => {
    if (result !== null) {
      setResult(null);
      setExpression([]);
      setCurrentInput(num);
      setIsNewNumber(false);
    } else if (isNewNumber) {
      setCurrentInput(num);
      setIsNewNumber(false);
    } else {
      setCurrentInput(currentInput + num);
    }
  };

  const handleOperationPress = (op: string) => {
    if (result !== null) {
      setExpression([result, op]);
      setResult(null);
    } else {
      setExpression([...expression, currentInput, op]);
    }
    setIsNewNumber(true);
  };

  const handleParentheses = (paren: '(' | ')') => {
    const openCount = expression.filter(x => x === '(').length;
    const closeCount = expression.filter(x => x === ')').length;

    if (paren === '(') {
      if (expression.length === 0 && !isNewNumber && currentInput !== '0') {
        setExpression(['(']);
        setCurrentInput(currentInput);
        setIsNewNumber(false);
      } else if (!isNewNumber && currentInput !== '0') {
        setExpression([...expression, currentInput, '*', '(']);
        setIsNewNumber(true);
      } else {
        setExpression([...expression, '(']);
        setIsNewNumber(true);
      }
    } else if (paren === ')' && openCount > closeCount && !isNewNumber) {
      setExpression([...expression, currentInput, ')']);
      setIsNewNumber(true);
    }
  };

  const evaluateExpression = (exp: string[]): number => {
    const precedence = {
      '*': 2,
      '/': 2,
      '+': 1,
      '-': 1,
    };

    const output: string[] = [];
    const operators: string[] = [];

    exp.forEach(token => {
      if (!isNaN(Number(token))) {
        output.push(token);
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          output.push(operators.pop()!);
        }
        operators.pop();
      } else {
        while (
          operators.length &&
          operators[operators.length - 1] !== '(' &&
          precedence[operators[operators.length - 1] as keyof typeof precedence] >= precedence[token as keyof typeof precedence]
        ) {
          output.push(operators.pop()!);
        }
        operators.push(token);
      }
    });

    while (operators.length) {
      output.push(operators.pop()!);
    }

    const stack: number[] = [];
    output.forEach(token => {
      if (!isNaN(Number(token))) {
        stack.push(Number(token));
      } else {
        const b = stack.pop()!;
        const a = stack.pop()!;
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(a / b); break;
        }
      }
    });

    return stack[0];
  };

  const handleEquals = () => {
    if (expression.length === 0 && result === null) {
      return;
    }

    let finalExpression = [...expression];
    if (!isNewNumber) {
      finalExpression.push(currentInput);
    }

    const openCount = finalExpression.filter(x => x === '(').length;
    const closeCount = finalExpression.filter(x => x === ')').length;
    for (let i = 0; i < openCount - closeCount; i++) {
      finalExpression.push(')');
    }

    const calculatedResult = evaluateExpression(finalExpression);
    setResult(calculatedResult.toString());
    setCurrentInput(calculatedResult.toString());
    setExpression([]);
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setCurrentInput('0');
    setExpression([]);
    setIsNewNumber(true);
    setResult(null);
  };

  const handleDecimal = () => {
    if (!currentInput.includes('.')) {
      setCurrentInput(currentInput + '.');
      setIsNewNumber(false);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      amount: parseFloat(currentInput),
      category,
      comment,
    });
  };

  const CalcButton = ({ 
    label, 
    onPress, 
    variant = 'default',
    size = 1 
  }: { 
    label: string | React.ReactNode;
    onPress: () => void;
    variant?: 'default' | 'operation' | 'equal' | 'special';
    size?: number;
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
              ? colors.accent
              : colors.secondary,
          opacity: pressed ? 0.8 : 1,
          flex: size,
        },
      ]}
    >
      {typeof label === 'string' ? (
        <Text 
          style={[
            styles.calcButtonText,
            { 
              color: variant === 'operation' || variant === 'special' ? '#FFFFFF' : colors.text,
              fontSize: variant === 'equal' ? 20 : 24,
            },
          ]}
        >
          {label}
        </Text>
      ) : (
        label
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => setShowCategoryModal(true)}
          style={styles.categoryButton}
        >
          <Text style={[styles.categoryText, { color: colors.text }]}>
            {category}
          </Text>
          <Tag size={16} color={colors.text} style={{ marginLeft: 8 }} />
        </Pressable>
        <View style={styles.headerButtons}>
          <Button
            variant="ghost"
            onPress={() => setShowCommentModal(true)}
            leftIcon={<MessageSquare size={20} color={colors.text} />}
            style={{ marginRight: 8 }}
          />
          <Button
            variant="ghost"
            onPress={onClose}
            leftIcon={<X size={20} color={colors.text} />}
          />
        </View>
      </View>

      <View style={[styles.display, { backgroundColor: colors.card }]}>
        <Text 
          style={[styles.displayText, { color: colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {getDisplayExpression()}
        </Text>
        {comment && (
          <Text style={[styles.commentPreview, { color: colors.textSecondary }]}>
            {comment}
          </Text>
        )}
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          <CalcButton 
            label="C"
            onPress={handleClear}
            variant="special"
          />
          <CalcButton 
            label="("
            onPress={() => handleParentheses('(')}
          />
          <CalcButton 
            label=")"
            onPress={() => handleParentheses(')')}
          />
          <CalcButton 
            label={<DollarSign size={20} color={colors.text} />}
            onPress={() => setShowCurrencyModal(true)}
          />
          <CalcButton 
            label={<Divide size={20} color="#FFFFFF" />}
            onPress={() => handleOperationPress('/')}
            variant="operation"
          />
        </View>
        <View style={styles.row}>
          <CalcButton label="7" onPress={() => handleNumberPress('7')} />
          <CalcButton label="8" onPress={() => handleNumberPress('8')} />
          <CalcButton label="9" onPress={() => handleNumberPress('9')} />
          <CalcButton 
            label={<Asterisk size={20} color="#FFFFFF" />}
            onPress={() => handleOperationPress('*')}
            variant="operation"
          />
          <CalcButton 
            label={<Plus size={24} color="#FFFFFF" />}
            onPress={() => handleOperationPress('+')}
            variant="operation"
          />
        </View>
        <View style={styles.row}>
          <CalcButton label="4" onPress={() => handleNumberPress('4')} />
          <CalcButton label="5" onPress={() => handleNumberPress('5')} />
          <CalcButton label="6" onPress={() => handleNumberPress('6')} />
          <CalcButton 
            label={<MessageSquare size={20} color="#FFFFFF" />}
            onPress={() => setShowCommentModal(true)}
            variant="operation"
          />
          <CalcButton 
            label={<Minus size={24} color="#FFFFFF" />}
            onPress={() => handleOperationPress('-')}
            variant="operation"
          />
        </View>
        <View style={styles.row}>
          <CalcButton label="1" onPress={() => handleNumberPress('1')} />
          <CalcButton label="2" onPress={() => handleNumberPress('2')} />
          <CalcButton label="3" onPress={() => handleNumberPress('3')} />
          <CalcButton 
            label={<Equal size={24} color="#FFFFFF" />}
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
            label={<Text style={[styles.calcButtonText, { color: colors.text }]}>.</Text>}
            onPress={handleDecimal}
          />
          <CalcButton 
            label={<Save size={24} color="#FFFFFF" />}
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Comment
            </Text>
            <TextInput
              style={[styles.commentInput, { 
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.border,
              }]}
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
                leftIcon={<Check size={20} color="#FFFFFF" />}
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Currency
            </Text>
            <ScrollView style={styles.currencyList}>
              {currencies.map((currency) => (
                <Pressable
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    {
                      backgroundColor:
                        selectedCurrency.code === currency.code
                          ? colors.primary
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.currencySymbol,
                      {
                        color:
                          selectedCurrency.code === currency.code
                            ? '#FFFFFF'
                            : colors.text,
                      },
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
                              ? '#FFFFFF'
                              : colors.text,
                        },
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
                              ? '#FFFFFF'
                              : colors.textSecondary,
                        },
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Category
            </Text>
            <ScrollView style={styles.categoryList}>
              {mockCategories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor:
                        category === cat.name
                          ? colors.primary
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setCategory(cat.name);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryName,
                      {
                        color:
                          category === cat.name
                            ? '#FFFFFF'
                            : colors.text,
                      },
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 24,
    fontWeight: '600',
  },
  display: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  historyText: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 4,
  },
  displayText: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'right',
  },
  commentPreview: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  keypad: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    height: 60,
  },
  calcButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  calcButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  currencyList: {
    maxHeight: 300,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 16,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyName: {
    fontSize: 14,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryOption: {
    padding: 16,
    borderRadius: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuickExpenseCalculator