export const evaluateExpression = (exp: string[]): number => {
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

export const getDisplayExpression = (
  expression: string[],
  currentInput: string
): string => {
  if (expression.length === 0) return currentInput
  return expression.join(' ') + (currentInput !== '0' ? ` ${currentInput}` : '')
}
