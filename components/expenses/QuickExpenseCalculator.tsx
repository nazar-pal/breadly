import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '../ui/Button';
import { X, Plus, Minus, Equal, Save } from 'lucide-react-native';

interface QuickExpenseCalculatorProps {
  category: string;
  onSubmit: (data: { amount: number; category: string }) => void;
  onClose: () => void;
}

export default function QuickExpenseCalculator({
  category,
  onSubmit,
  onClose,
}: QuickExpenseCalculatorProps) {
  const { colors } = useTheme();
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumberPress = (num: string) => {
    if (isNewNumber) {
      setDisplayValue(num);
      setIsNewNumber(false);
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleOperationPress = (op: string) => {
    const currentValue = parseFloat(displayValue);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setPreviousValue(result);
      setDisplayValue(result.toString());
    }
    
    setOperation(op);
    setIsNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(displayValue);
      const result = calculate(previousValue, currentValue, operation);
      setDisplayValue(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperation(null);
    setIsNewNumber(true);
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
    variant?: 'default' | 'operation' | 'equal';
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
              color: variant === 'operation' ? '#FFFFFF' : colors.text,
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
        <Button
          variant="ghost"
          onPress={onClose}
          leftIcon={<X size={20} color={colors.text} />}
        />
      </View>

      <View 
        style={[
          styles.display,
          { backgroundColor: colors.card }
        ]}
      >
        <Text 
          style={[
            styles.displayText,
            { color: colors.text }
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          ${displayValue}
        </Text>
      </View>

      <View style={styles.keypad}>
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
          <CalcButton label="." onPress={handleDecimal} />
          <CalcButton 
            label={<Save size={24} color="#FFFFFF" />}
            onPress={handleSubmit}
            variant="equal"
          />
        </View>
      </View>
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
  displayText: {
    fontSize: 36,
    fontWeight: '700',
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
});