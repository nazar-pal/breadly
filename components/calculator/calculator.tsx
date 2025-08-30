import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React, { useState } from 'react'
import { View } from 'react-native'
import { CalculatorDisplay } from './calculator-display'
import { CalculatorKeypad } from './calculator-keypad'
import { CommentModal } from './comment-modal'

interface Props {
  type: 'expense' | 'income'
  isDisabled: boolean
  handleSubmit: (amount: number, comment: string) => void
  currencySymbol?: string
}

export function Calculator({
  type,
  isDisabled,
  handleSubmit,
  currencySymbol
}: Props) {
  const [comment, setComment] = useState('')
  const [showCommentModal, setShowCommentModal] = useState(false)

  const [currentInput, setCurrentInput] = useState('0')
  const [expression, setExpression] = useState<string[]>([])

  return (
    <>
      <CalculatorDisplay
        comment={comment}
        expression={expression}
        currentInput={currentInput}
        currencySymbol={currencySymbol}
      />

      <CalculatorKeypad
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        expression={expression}
        setExpression={setExpression}
      />

      <View className="mt-4 flex-row items-center gap-4">
        <Button
          onPress={() => setShowCommentModal(true)}
          size="lg"
          className="relative flex-row items-center justify-center rounded-xl bg-card active:scale-95"
          variant="outline"
        >
          <Icon name="MessageSquare" size={24} className="text-foreground" />
          {comment && (
            <View className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </Button>

        {/* Submit Button */}
        <Button
          onPress={() => handleSubmit(parseFloat(currentInput), comment)}
          size="lg"
          className="flex-1 flex-row items-center justify-center rounded-xl"
          disabled={isDisabled}
        >
          <Icon
            name="Save"
            size={20}
            className="mr-2 text-primary-foreground"
          />
          <Text>{`Save ${type === 'expense' ? 'Expense' : 'Income'}`}</Text>
        </Button>
      </View>

      <CommentModal
        visible={showCommentModal}
        comment={comment}
        onChangeComment={setComment}
        onClose={() => setShowCommentModal(false)}
      />
    </>
  )
}
