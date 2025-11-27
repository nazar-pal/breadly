import { Icon } from '@/components/ui/icon-by-name'
import React, { useState } from 'react'
import { View } from 'react-native'
import { CalculatorButton } from './calculator-button'

interface Props {
  currentInput: string
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>
  expression: string[]
  setExpression: React.Dispatch<React.SetStateAction<string[]>>
  onSubmit: () => void
  showSubmit: boolean
  submitDisabled?: boolean
  onPressComment: () => void
  onPressDate: () => void
  hasComment: boolean
}

export function CalculatorKeypad({
  currentInput,
  setCurrentInput,
  expression,
  setExpression,
  onSubmit,
  showSubmit,
  submitDisabled = false,
  onPressComment,
  onPressDate,
  hasComment
}: Props) {
  const [isNewNumber, setIsNewNumber] = useState(true)

  const evaluateExpression = (exp: string[]): number => {
    try {
      const evalString = exp.join(' ')
      // Basic safety check - only allow numbers and basic operators
      if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(evalString)) {
        throw new Error('Invalid expression')
      }
      // Note: In production, use a proper math expression parser
      // This is a simplified version for demo purposes
      return Function(`"use strict"; return (${evalString})`)()
    } catch {
      return 0
    }
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

  const handleEquals = () => {
    if (expression.length > 0) {
      const fullExpression = [...expression, currentInput]
      const resultValue = evaluateExpression(fullExpression)

      // Handle invalid results (Infinity, -Infinity, NaN)
      if (!Number.isFinite(resultValue)) {
        setCurrentInput('0')
        setExpression([])
        setIsNewNumber(true)
        return
      }

      setCurrentInput(resultValue.toString())
      setExpression([])
      setIsNewNumber(true)
    }
  }

  const handleBackspace = () => {
    // If we just pressed an operator, undo it and restore the previous number
    if (isNewNumber && expression.length >= 2) {
      const previousNumber = expression[expression.length - 2]
      setCurrentInput(previousNumber)
      setExpression(expression.slice(0, -2))
      setIsNewNumber(false)
      return
    }

    if (isNewNumber || currentInput.length === 0) {
      return
    }

    // Single character or just minus sign - reset to 0
    if (currentInput.length === 1 || currentInput === '-0') {
      setCurrentInput('0')
      setIsNewNumber(true)
      return
    }

    const newValue = currentInput.slice(0, -1)

    // If backspace would leave just '-', reset to 0
    if (newValue === '-') {
      setCurrentInput('0')
      setIsNewNumber(true)
      return
    }

    setCurrentInput(newValue)
  }

  const handleDecimal = () => {
    // If starting fresh (after = or operation), begin with "0."
    if (isNewNumber) {
      setCurrentInput('0.')
      setIsNewNumber(false)
      return
    }

    // Only add decimal if there isn't one already
    if (!currentInput.includes('.')) {
      setCurrentInput(currentInput + '.')
    }
  }

  const handleToggleSign = () => {
    // Don't toggle sign for zero or zero with decimal
    if (currentInput === '0' || currentInput === '0.') {
      return
    }

    if (currentInput.startsWith('-')) {
      setCurrentInput(currentInput.slice(1))
    } else {
      setCurrentInput('-' + currentInput)
    }
    setIsNewNumber(false)
  }

  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <CalculatorButton
          label={<Icon name="Delete" size={20} className="text-primary" />}
          onPress={handleBackspace}
          accessibilityLabel="Delete"
        />
        <CalculatorButton
          label={
            <View className="relative">
              <Icon name="MessageSquare" size={20} className="text-primary" />
              {hasComment && (
                <View className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </View>
          }
          onPress={onPressComment}
          accessibilityLabel="Add comment"
        />
        <CalculatorButton
          label={<Icon name="Calendar" size={20} className="text-primary" />}
          onPress={onPressDate}
          accessibilityLabel="Change date"
        />
        <CalculatorButton
          label="÷"
          onPress={() => handleOperationPress('/')}
          variant="operation"
        />
      </View>

      <View className="flex-row gap-2">
        <CalculatorButton label="7" onPress={() => handleNumberPress('7')} />
        <CalculatorButton label="8" onPress={() => handleNumberPress('8')} />
        <CalculatorButton label="9" onPress={() => handleNumberPress('9')} />
        <CalculatorButton
          label="×"
          onPress={() => handleOperationPress('*')}
          variant="operation"
        />
      </View>

      <View className="flex-row gap-2">
        <CalculatorButton label="4" onPress={() => handleNumberPress('4')} />
        <CalculatorButton label="5" onPress={() => handleNumberPress('5')} />
        <CalculatorButton label="6" onPress={() => handleNumberPress('6')} />
        <CalculatorButton
          label="−"
          onPress={() => handleOperationPress('-')}
          variant="operation"
        />
      </View>

      <View className="flex-row gap-2">
        <CalculatorButton label="1" onPress={() => handleNumberPress('1')} />
        <CalculatorButton label="2" onPress={() => handleNumberPress('2')} />
        <CalculatorButton label="3" onPress={() => handleNumberPress('3')} />
        <CalculatorButton
          label="+"
          onPress={() => handleOperationPress('+')}
          variant="operation"
        />
      </View>

      <View className="flex-row gap-2">
        <CalculatorButton
          label="±"
          onPress={handleToggleSign}
          accessibilityLabel="Toggle sign"
        />
        <CalculatorButton label="0" onPress={() => handleNumberPress('0')} />
        <CalculatorButton label="." onPress={handleDecimal} />
        {showSubmit ? (
          <CalculatorButton
            label="="
            onPress={handleEquals}
            variant="operation"
          />
        ) : (
          <CalculatorButton
            label={
              <Icon name="Save" size={20} className="text-primary-foreground" />
            }
            onPress={onSubmit}
            variant={submitDisabled ? 'success-disabled' : 'success'}
            disabled={submitDisabled}
            accessibilityLabel="Save"
          />
        )}
      </View>
    </View>
  )
}
