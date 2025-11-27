import { useState } from 'react'
import type { Digit, Operator } from './types'
import { evaluateExpression, formatDisplayValue } from './utils'

interface CalculatorState {
  currentInput: string
  expression: string[]
  isNewNumber: boolean
}

interface UseCalculatorReturn {
  // Display values
  currentInput: string
  displayValue: string
  shouldShowEquals: boolean

  // Actions
  pressNumber: (digit: Digit) => void
  pressOperation: (operator: Operator) => void
  pressEquals: () => void
  pressBackspace: () => void
  pressDecimal: () => void
  toggleSign: () => void
  clear: () => void
}

const INITIAL_STATE: CalculatorState = {
  currentInput: '0',
  expression: [],
  isNewNumber: true
}

export function useCalculator(): UseCalculatorReturn {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE)
  const { currentInput, expression } = state

  // Derived state
  const displayValue = formatDisplayValue(expression, currentInput)

  const shouldShowEquals = (() => {
    if (expression.length === 0) {
      return false
    }

    const lastToken = expression[expression.length - 1]
    const isOperator =
      lastToken === '+' ||
      lastToken === '-' ||
      lastToken === '*' ||
      lastToken === '/'

    return isOperator || expression.length >= 2
  })()

  // Actions
  const pressNumber = (digit: Digit) => {
    setState(prev => {
      if (prev.isNewNumber) {
        return {
          ...prev,
          currentInput: digit,
          isNewNumber: false
        }
      }

      if (prev.currentInput === '0') {
        return {
          ...prev,
          currentInput: digit
        }
      }

      return {
        ...prev,
        currentInput: prev.currentInput + digit
      }
    })
  }

  const pressOperation = (operator: Operator) => {
    setState(prev => ({
      ...prev,
      expression: [...prev.expression, prev.currentInput, operator],
      currentInput: '0',
      isNewNumber: true
    }))
  }

  const pressEquals = () => {
    setState(prev => {
      if (prev.expression.length === 0) {
        return prev
      }

      const fullExpression = [...prev.expression, prev.currentInput]
      const result = evaluateExpression(fullExpression)

      // Handle invalid results (Infinity, -Infinity, NaN)
      if (!Number.isFinite(result)) {
        return INITIAL_STATE
      }

      return {
        currentInput: result.toString(),
        expression: [],
        isNewNumber: true
      }
    })
  }

  const pressBackspace = () => {
    setState(prev => {
      // If we just pressed an operator, undo it and restore the previous number
      if (prev.isNewNumber && prev.expression.length >= 2) {
        const previousNumber = prev.expression[prev.expression.length - 2]
        return {
          ...prev,
          currentInput: previousNumber,
          expression: prev.expression.slice(0, -2),
          isNewNumber: false
        }
      }

      if (prev.isNewNumber || prev.currentInput.length === 0) {
        return prev
      }

      // Single character or just minus sign - reset to 0
      if (prev.currentInput.length === 1 || prev.currentInput === '-0') {
        return {
          ...prev,
          currentInput: '0',
          isNewNumber: true
        }
      }

      const newValue = prev.currentInput.slice(0, -1)

      // If backspace would leave just '-', reset to 0
      if (newValue === '-') {
        return {
          ...prev,
          currentInput: '0',
          isNewNumber: true
        }
      }

      return {
        ...prev,
        currentInput: newValue
      }
    })
  }

  const pressDecimal = () => {
    setState(prev => {
      // If starting fresh (after = or operation), begin with "0."
      if (prev.isNewNumber) {
        return {
          ...prev,
          currentInput: '0.',
          isNewNumber: false
        }
      }

      // Only add decimal if there isn't one already
      if (prev.currentInput.includes('.')) {
        return prev
      }

      return {
        ...prev,
        currentInput: prev.currentInput + '.'
      }
    })
  }

  const toggleSign = () => {
    setState(prev => {
      // Don't toggle sign for zero or zero with decimal
      if (prev.currentInput === '0' || prev.currentInput === '0.') {
        return prev
      }

      const newInput = prev.currentInput.startsWith('-')
        ? prev.currentInput.slice(1)
        : '-' + prev.currentInput

      return {
        ...prev,
        currentInput: newInput,
        isNewNumber: false
      }
    })
  }

  const clear = () => {
    setState(INITIAL_STATE)
  }

  return {
    // Display values
    currentInput,
    displayValue,
    shouldShowEquals,

    // Actions
    pressNumber,
    pressOperation,
    pressEquals,
    pressBackspace,
    pressDecimal,
    toggleSign,
    clear
  }
}
