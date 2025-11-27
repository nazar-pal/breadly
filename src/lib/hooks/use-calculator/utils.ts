/**
 * Evaluates a mathematical expression represented as an array of tokens.
 * @param tokens - Array of numbers and operators, e.g., ['5', '+', '3', '*', '2']
 * @returns The calculated result, or 0 if evaluation fails
 */
export function evaluateExpression(tokens: string[]): number {
  try {
    const evalString = tokens.join(' ')

    // Basic safety check - only allow numbers and basic operators
    if (!/^[\d\s+\-*/().]+$/.test(evalString)) {
      throw new Error('Invalid expression')
    }

    // Note: In production, consider using a proper math expression parser
    // This is a simplified version that leverages JavaScript's evaluation
    const result = Function(`"use strict"; return (${evalString})`)()

    return typeof result === 'number' ? result : 0
  } catch {
    return 0
  }
}

/**
 * Formats the calculator display by combining expression tokens with current input.
 * @param expression - Array of previous tokens (numbers and operators)
 * @param currentInput - The number currently being entered
 * @returns Formatted string for display
 */
export function formatDisplayValue(
  expression: string[],
  currentInput: string
): string {
  if (expression.length === 0) {
    return currentInput
  }

  return expression.join(' ') + (currentInput !== '0' ? ` ${currentInput}` : '')
}
