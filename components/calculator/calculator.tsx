import React, { useState } from 'react'
import { CalculatorDisplay } from './calculator-display'
import { CalculatorKeypad } from './calculator-keypad'
import { CommentModal } from './modal-comment'
import { DateModal } from './modal-date'

interface Props {
  type: 'expense' | 'income'
  isDisabled: boolean
  handleSubmit: (amount: number, comment: string, txDate?: Date) => void
}

export function Calculator({ type, isDisabled, handleSubmit }: Props) {
  const [comment, setComment] = useState('')
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [currentInput, setCurrentInput] = useState('0')
  const [expression, setExpression] = useState<string[]>([])

  const numericCurrentValue = parseFloat(currentInput)

  const shouldShowEquals = (() => {
    if (expression.length === 0) {
      return false
    }

    const lastToken = expression[expression.length - 1]
    const hasOperator = /[+\-*/]/.test(lastToken)

    return hasOperator || expression.length >= 2
  })()

  const isSaveDisabled = (() => {
    if (shouldShowEquals) {
      return true
    }

    if (isDisabled) {
      return true
    }

    if (Number.isNaN(numericCurrentValue)) {
      return true
    }

    return numericCurrentValue <= 0
  })()

  return (
    <>
      <CalculatorDisplay
        comment={comment}
        expression={expression}
        currentInput={currentInput}
        selectedDate={selectedDate}
      />

      <CalculatorKeypad
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        expression={expression}
        setExpression={setExpression}
        onSubmit={() => {
          if (!isSaveDisabled) {
            handleSubmit(parseFloat(currentInput), comment, selectedDate)
          }
        }}
        showSubmit={shouldShowEquals}
        submitDisabled={isSaveDisabled}
        onPressComment={() => setShowCommentModal(true)}
        onPressDate={() => setShowDateModal(true)}
        hasComment={Boolean(comment)}
      />

      <CommentModal
        visible={showCommentModal}
        comment={comment}
        onChangeComment={setComment}
        onClose={() => setShowCommentModal(false)}
      />

      <DateModal
        visible={showDateModal}
        selectedDate={selectedDate}
        onSelectDate={d => setSelectedDate(d)}
        onClose={() => setShowDateModal(false)}
      />
    </>
  )
}
