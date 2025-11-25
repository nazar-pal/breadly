import { Icon } from '@/components/ui/icon-by-name'
import { useColorScheme } from 'nativewind'
import React, { useMemo } from 'react'
import {
  Calendar as RNCalendar,
  CalendarProps as RNCalendarProps
} from 'react-native-calendars'
import { Theme } from 'react-native-calendars/src/types'

export interface CalendarProps extends RNCalendarProps {
  /** Color for selected date */
  selectionColor?: string
}

export function Calendar({
  selectionColor = '#6366F1',
  markedDates,
  renderArrow,
  onDayPress,
  theme,
  style,
  ...restCalendarProps
}: CalendarProps) {
  const { colorScheme } = useColorScheme()

  // Prepare Calendar theme merged with external theme
  const isDark = colorScheme === 'dark'
  const calendarTheme = useMemo(() => {
    const baseTheme: Theme = {
      backgroundColor: 'transparent',
      calendarBackground: 'transparent',
      textSectionTitleColor: isDark ? '#A1A1AA' : '#6B7280',
      selectedDayBackgroundColor: selectionColor,
      selectedDayTextColor: '#FFFFFF',
      todayTextColor: selectionColor,
      dayTextColor: isDark ? '#E5E7EB' : '#111827',
      textDisabledColor: isDark ? '#6B7280' : '#9CA3AF',
      arrowColor: selectionColor,
      monthTextColor: isDark ? '#E5E7EB' : '#111827',
      indicatorColor: selectionColor,
      textDayFontSize: 16,
      textDayHeaderFontSize: 12,
      textMonthFontSize: 16,
      arrowStyle: { padding: 8 },
      stylesheet: {
        calendar: {
          main: {
            container: {
              backgroundColor: 'transparent'
            },
            week: {
              backgroundColor: 'transparent'
            }
          },
          header: {
            week: {
              backgroundColor: 'transparent'
            }
          }
        },
        day: {
          basic: {
            base: {
              backgroundColor: 'transparent'
            }
          },
          period: {
            base: {
              backgroundColor: 'transparent'
            }
          }
        }
      }
    }
    return { ...baseTheme, ...(theme || {}) }
  }, [isDark, selectionColor, theme])

  return (
    <RNCalendar
      {...restCalendarProps}
      markedDates={markedDates}
      onDayPress={onDayPress}
      renderArrow={direction =>
        renderArrow ? (
          renderArrow(direction)
        ) : (
          <Icon
            name={direction === 'left' ? 'ChevronLeft' : 'ChevronRight'}
            size={18}
            className="text-primary"
          />
        )
      }
      style={[{ backgroundColor: 'transparent' }, style]}
      theme={calendarTheme}
    />
  )
}
