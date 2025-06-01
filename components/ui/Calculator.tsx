import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { X, Plus, Minus, Divide, Equal, Delete } from 'lucide-react-native';

type CalculatorProps = {
  onClose: () => void;
  onSubmit: (value: string) => void;
};

export default function Calculator({ onClose, onSubmit }: CalculatorProps) {
  const { colors } = useTheme();
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operator) {
      const result = calculate(previousValue, current, operator);
      setPreviousValue(result);
      setDisplay(result.toString());
    }
    
    setOperator(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (operator && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operator);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperator(null);
      setNewNumber(true);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setOperator(null);
    setPreviousValue(null);
    setNewNumber(true);
  };

  const handleSubmit = () => {
    onSubmit(display);
  };

  const Button = ({ 
    label, 
    onPress, 
    type = 'number',
    icon: Icon,
  }: { 
    label?: string; 
    onPress: () => void; 
    type?: 'number' | 'operator' | 'action';
    icon?: React.ComponentType<any>;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: type === 'operator' 
            ? colors.primary 
            : type === 'action'
            ? colors.secondary
            : colors.card,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {Icon ? (
        <Icon 
          size={24} 
          color={type === 'operator' ? '#fff' : colors.text} 
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color: type === 'operator' ? '#fff' : colors.text,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.display, { color: colors.text }]}>
          ${display}
        </Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        <Button label="7" onPress={() => handleNumber('7')} />
        <Button label="8" onPress={() => handleNumber('8')} />
        <Button label="9" onPress={() => handleNumber('9')} />
        <Button 
          icon={Delete} 
          onPress={handleDelete} 
          type="action" 
        />

        <Button label="4" onPress={() => handleNumber('4')} />
        <Button label="5" onPress={() => handleNumber('5')} />
        <Button label="6" onPress={() => handleNumber('6')} />
        <Button 
          icon={Plus} 
          onPress={() => handleOperator('+')} 
          type="operator" 
        />

        <Button label="1" onPress={() => handleNumber('1')} />
        <Button label="2" onPress={() => handleNumber('2')} />
        <Button label="3" onPress={() => handleNumber('3')} />
        <Button 
          icon={Minus} 
          onPress={() => handleOperator('-')} 
          type="operator" 
        />

        <Button label="." onPress={handleDecimal} />
        <Button label="0" onPress={() => handleNumber('0')} />
        <Button 
          icon={Equal} 
          onPress={handleEqual} 
          type="operator" 
        />
        <Button 
          icon={Divide} 
          onPress={() => handleOperator('÷')} 
          type="operator" 
        />
      </View>

      <Pressable
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Use Amount</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  display: {
    fontSize: 36,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});