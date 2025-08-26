import React, { useState } from 'react'
import { View } from 'react-native'
import { CalculatorButton } from './calculator-button'

interface Props {
  currentInput: string
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>
  expression: string[]
  setExpression: React.Dispatch<React.SetStateAction<string[]>>
}

export function CalculatorKeypad({
  currentInput,
  setCurrentInput,
  expression,
  setExpression
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

  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <CalculatorButton label="C" onPress={handleClear} variant="special" />
        <CalculatorButton
          label="("
          onPress={() => handleParentheses('(')}
          variant="operation"
        />
        <CalculatorButton
          label=")"
          onPress={() => handleParentheses(')')}
          variant="operation"
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
          label="0"
          onPress={() => handleNumberPress('0')}
          isWide={true}
        />
        <CalculatorButton label="." onPress={handleDecimal} />
        <CalculatorButton label="=" onPress={handleEquals} variant="equal" />
      </View>
    </View>
  )
}
