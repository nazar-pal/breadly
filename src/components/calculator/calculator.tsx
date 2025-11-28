import { Text } from '@/components/ui/text'
import { useCalculator } from '@/lib/hooks/use-calculator'
import { format } from 'date-fns'
import { useState } from 'react'
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

  // Calculator logic
  const calculator = useCalculator()

  // Transaction metadata
  const [comment, setComment] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Modal visibility
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)

  // Derived state
  const numericValue = parseFloat(calculator.currentInput)
  const isSaveDisabled =
    calculator.shouldShowEquals ||
    isDisabled ||
    !Number.isFinite(numericValue) ||
    numericValue <= 0

  const handleSave = () => {
    if (!isSaveDisabled) {
      handleSubmit(numericValue, comment, selectedDate)
    }
  }

  return (
    <>
      <CalculatorDisplay displayValue={calculator.displayValue} />

      {/* Fixed height comment area - prevents layout shift */}
      <View className="h-8 items-center justify-center px-4">
        {comment ? (
          <Text
            className="text-muted-foreground text-center text-sm italic"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {`"${comment}"`}
          </Text>
        ) : null}
      </View>

      <CalculatorKeypad
        onPressNumber={calculator.pressNumber}
        onPressOperation={calculator.pressOperation}
        onPressEquals={calculator.pressEquals}
        onPressBackspace={calculator.pressBackspace}
        onClear={calculator.clear}
        onPressDecimal={calculator.pressDecimal}
        onToggleSign={calculator.toggleSign}
        onPressComment={() => setShowCommentModal(true)}
        onPressDate={() => setShowDateModal(true)}
        onSubmit={handleSave}
        showEquals={calculator.shouldShowEquals}
        submitDisabled={isSaveDisabled}
        hasComment={Boolean(comment)}
      />

      {/* Transaction date - extends into safe area with small padding */}
      <View
        className="mt-3 items-center"
        style={{ marginBottom: -insets.bottom, paddingBottom: 8 }}
      >
        <Text className="text-muted-foreground text-sm">
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
        onSelectDate={setSelectedDate}
        onClose={() => setShowDateModal(false)}
      />
    </>
  )
}
