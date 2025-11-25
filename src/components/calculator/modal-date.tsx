import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Text } from '@/components/ui/text'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon-by-name'

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
  const [visibleYear, setVisibleYear] = useState<number>(
    selectedDate.getFullYear()
  )
  const [visibleMonth, setVisibleMonth] = useState<number>(
    selectedDate.getMonth() + 1
  )
  const handleToday = () => {
    onSelectDate(new Date())
    onClose()
  }
  const handleYesterday = () => {
    onSelectDate(new Date(Date.now() - 24 * 60 * 60 * 1000))
    onClose()
  }

  const pad = (n: number) => `${n}`.padStart(2, '0')
  const key = `${selectedDate.getFullYear()}-${pad(
    selectedDate.getMonth() + 1
  )}-${pad(selectedDate.getDate())}`
  const todayKey = (() => {
    const today = new Date()
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
      today.getDate()
    )}`
  })()
  const marked = {
    [key]: { selected: true }
  }

  return (
    <Dialog open={visible} onOpenChange={o => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select date</DialogTitle>
        </DialogHeader>
        <View className="p-6 pt-0">
          <Calendar
            markedDates={marked}
            maxDate={todayKey}
            enableSwipeMonths={false}
            onMonthChange={m => {
              setVisibleYear(m.year)
              setVisibleMonth(m.month)
            }}
            {...(() => {
              const today = new Date()
              const ty = today.getFullYear()
              const tm = today.getMonth() + 1
              const isRightDisabled =
                visibleYear > ty || (visibleYear === ty && visibleMonth >= tm)
              const isLeftDisabled = visibleYear === ty && visibleMonth === tm
              return {
                disableArrowLeft: isLeftDisabled,
                disableArrowRight: isRightDisabled,
                onPressArrowLeft: (subtractMonth: () => void) => {
                  if (!isLeftDisabled) subtractMonth()
                },
                onPressArrowRight: (addMonth: () => void) => {
                  if (!isRightDisabled) addMonth()
                },
                renderArrow: (direction: 'left' | 'right') => {
                  const isDisabled =
                    direction === 'right' ? isRightDisabled : isLeftDisabled
                  return (
                    <Icon
                      name={
                        direction === 'left' ? 'ChevronLeft' : 'ChevronRight'
                      }
                      size={18}
                      className={
                        isDisabled ? 'text-muted-foreground/40' : 'text-primary'
                      }
                    />
                  )
                }
              }
            })()}
            onDayPress={day => {
              const d = new Date(day.year, day.month - 1, day.day)
              onSelectDate(d)
              onClose()
            }}
          />
          <View className="mt-4 flex-row items-center gap-2">
            <Button variant="default" className="w-1/2" onPress={handleToday}>
              <Text>Today</Text>
            </Button>
            <Button
              variant="outline"
              className="w-1/2"
              onPress={handleYesterday}
            >
              <Text>Yesterday</Text>
            </Button>
          </View>
        </View>
      </DialogContent>
    </Dialog>
  )
}
