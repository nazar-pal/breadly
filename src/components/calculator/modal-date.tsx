import { CalendarDialog } from '@/components/ui/calendar-dialog'
import { Text } from '@/components/ui/text'
import { toDateId } from '@marceloterreiro/flash-calendar'
import { startOfToday, subDays } from 'date-fns'
import { View } from 'react-native'
import { Button } from '../ui/button'

export function DateModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose
}: {
  visible: boolean
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onClose: () => void
}) {
  const todayId = toDateId(new Date())

  const handleDateSelect = (date: Date) => {
    onSelectDate(date)
    onClose()
  }

  return (
    <CalendarDialog
      open={visible}
      onOpenChange={o => !o && onClose()}
      title="Select date"
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      calendarMaxDateId={todayId}
      calendarFutureScrollRangeInMonths={0}
    >
      <View className="flex-row items-center gap-2">
        <Button
          variant="default"
          className="w-1/2"
          onPress={() => {
            onSelectDate(startOfToday())
            onClose()
          }}
        >
          <Text>Today</Text>
        </Button>
        <Button
          variant="outline"
          className="w-1/2"
          onPress={() => {
            onSelectDate(subDays(startOfToday(), 1))
            onClose()
          }}
        >
          <Text>Yesterday</Text>
        </Button>
      </View>
    </CalendarDialog>
  )
}
