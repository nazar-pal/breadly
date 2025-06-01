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
  Parentheses,
  Divide,
  Asterisk,
  Check,
} from 'lucide-react-native';

interface QuickExpenseCalculatorProps {
  category: string;
  onSubmit: (data: { amount: number; category: string; comment?: string }) => void;
  onClose: () => void;
}

export default function QuickExpenseCalculator({
  category,
  onSubmit,
  onClose,
}: QuickExpenseCalculatorProps) {
  const { colors } = useTheme();
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState<string[]>([]);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleNumberPress = (num: string) => {
    if (isNewNumber) {
      setDisplayValue(num);
      setIsNewNumber(false);
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleOperationPress = (op: string) => {
    setExpression([...expression, displayValue, op]);
    setIsNewNumber(true);
    setHistory([...history, displayValue, op]);
  };

  const handleParentheses = (paren: '(' | ')') => {
    if (paren === '(' || (paren === ')' && expression.filter(x => x === '(').length > expression.filter(x => x === ')').length)) {
      setExpression([...expression, paren]);
      setHistory([...history, paren]);
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
        operators.pop(); // Remove '('
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
    const finalExpression = [...expression, displayValue];
    const result = evaluateExpression(finalExpression);
    setDisplayValue(result.toString());
    setExpression([]);
    setIsNewNumber(true);
    setHistory([...history, displayValue, '=', result.toString()]);
  };

  const handleClear = () => {
    setDisplayValue('0');
    setExpression([]);
    setIsNewNumber(true);
    setHistory([]);
  };

  const handleDecimal = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
      setIsNewNumber(false);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      amount: parseFloat(displayValue),
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
        <Text style={[styles.categoryText, { color: colors.text }]}>
          {category}
        </Text>
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
        {history.length > 0 && (
          <Text style={[styles.historyText, { color: colors.textSecondary }]}>
            {history.join(' ')}
          </Text>
        )}
        <Text 
          style={[styles.displayText, { color: colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          ${displayValue}
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
            label={<Parentheses size={20} color={colors.text} />}
            onPress={() => handleParentheses('(')}
            variant="default"
          />
          <CalcButton 
            label={<Text style={[styles.calcButtonText, { color: colors.text }]}>)</Text>}
            onPress={() => handleParentheses(')')}
            variant="default"
          />
          <CalcButton 
            label={<Divide size={20} color="#FFFFFF" />}
            onPress={() => handleOperationPress('/')}
            variant="operation"
          />
          <CalcButton 
            label={<Asterisk size={20} color="#FFFFFF" />}
            onPress={() => handleOperationPress('*')}
            variant="operation"
          />
        </View>
        <View style={styles.row}>
          <CalcButton label="7" onPress={() => handleNumberPress('7')} />
          <CalcButton label="8" onPress={() => handleNumberPress('8')} />
          <CalcButton label="9" onPress={() => handleNumberPress('9')} />
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
          />
        </View>
        <View style={styles.row}>
          <CalcButton label="C" onPress={handleClear} />
          <CalcButton label="0" onPress={() => handleNumberPress('0')} />
          <CalcButton 
            label={<Text style={[styles.calcButtonText, { color: colors.text }]}>.</Text>}
            onPress={handleDecimal}
          />
          <CalcButton 
            label={<Save size={24} color="#FFFFFF" />}
            onPress={handleSubmit}
            variant="equal"
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
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  calcButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 24,
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
});