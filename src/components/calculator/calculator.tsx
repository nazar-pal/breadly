import { Text } from '@/components/ui/text'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CalculatorDisplay } from './calculator-display'
import { CalculatorKeypad } from './calculator-keypad'
import { CommentModal } from './modal-comment'
import { DateModal } from './modal-date'

interface Props {
  isDisabled: boolean
  handleSubmit: (amount: number, comment: string, txDate?: Date) => void
}

export function Calculator({ isDisabled, handleSubmit }: Props) {
  const insets = useSafeAreaInsets()
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
      <CalculatorDisplay expression={expression} currentInput={currentInput} />

      {/* Fixed height comment area - prevents layout shift */}
      <View className="h-8 items-center justify-center">
        {comment ? (
          <Text
            className="text-center text-xs text-muted-foreground"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {comment}
          </Text>
        ) : null}
      </View>

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

      {/* Transaction date - extends into safe area with small padding */}
      <View
        className="mt-3 items-center"
        style={{ marginBottom: -insets.bottom, paddingBottom: 8 }}
      >
        <Text className="text-sm text-muted-foreground">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </Text>
      </View>

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
