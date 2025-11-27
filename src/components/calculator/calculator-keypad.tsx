import { Icon } from '@/components/ui/icon-by-name'
import type { Digit, Operator } from '@/lib/hooks/use-calculator'
import { View } from 'react-native'
import { CalculatorButton } from './calculator-button'

interface Props {
  // Calculator actions
  onPressNumber: (digit: Digit) => void
  onPressOperation: (operator: Operator) => void
  onPressEquals: () => void
  onPressBackspace: () => void
  onClear: () => void
  onPressDecimal: () => void
  onToggleSign: () => void

  // Toolbar actions
  onPressComment: () => void
  onPressDate: () => void
  onSubmit: () => void

  // State for conditional rendering
  showEquals: boolean
  submitDisabled: boolean
  hasComment: boolean
}

export function CalculatorKeypad({
  onPressNumber,
  onPressOperation,
  onPressEquals,
  onPressBackspace,
  onClear,
  onPressDecimal,
  onToggleSign,
  onPressComment,
  onPressDate,
  onSubmit,
  showEquals,
  submitDisabled,
  hasComment
}: Props) {
  return (
    <View className="gap-2">
      {/* Row 1: Utility buttons + Division */}
      <View className="flex-row gap-2">
        <CalculatorButton
          label={<Icon name="Delete" size={20} className="text-primary" />}
          onPress={onPressBackspace}
          onLongPress={onClear}
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
          onPress={() => onPressOperation('/')}
          variant="operation"
        />
      </View>

      {/* Row 2: 7, 8, 9, × */}
      <View className="flex-row gap-2">
        <CalculatorButton label="7" onPress={() => onPressNumber('7')} />
        <CalculatorButton label="8" onPress={() => onPressNumber('8')} />
        <CalculatorButton label="9" onPress={() => onPressNumber('9')} />
        <CalculatorButton
          label="×"
          onPress={() => onPressOperation('*')}
          variant="operation"
        />
      </View>

      {/* Row 3: 4, 5, 6, − */}
      <View className="flex-row gap-2">
        <CalculatorButton label="4" onPress={() => onPressNumber('4')} />
        <CalculatorButton label="5" onPress={() => onPressNumber('5')} />
        <CalculatorButton label="6" onPress={() => onPressNumber('6')} />
        <CalculatorButton
          label="−"
          onPress={() => onPressOperation('-')}
          variant="operation"
        />
      </View>

      {/* Row 4: 1, 2, 3, + */}
      <View className="flex-row gap-2">
        <CalculatorButton label="1" onPress={() => onPressNumber('1')} />
        <CalculatorButton label="2" onPress={() => onPressNumber('2')} />
        <CalculatorButton label="3" onPress={() => onPressNumber('3')} />
        <CalculatorButton
          label="+"
          onPress={() => onPressOperation('+')}
          variant="operation"
        />
      </View>

      {/* Row 5: ±, 0, ., =/Save */}
      <View className="flex-row gap-2">
        <CalculatorButton
          label="±"
          onPress={onToggleSign}
          accessibilityLabel="Toggle sign"
        />
        <CalculatorButton label="0" onPress={() => onPressNumber('0')} />
        <CalculatorButton label="." onPress={onPressDecimal} />
        {showEquals ? (
          <CalculatorButton
            label="="
            onPress={onPressEquals}
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
