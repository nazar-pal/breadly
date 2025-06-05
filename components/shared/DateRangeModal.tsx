import { useTheme, useThemedStyles } from '@/context/ThemeContext';
import { DateRange, DateRangeMode } from '@/hooks/useDateRange';
import { Check, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DateRangeModalProps {
  visible: boolean;
  currentMode: DateRangeMode;
  onSelectMode: (mode: DateRangeMode, customRange?: DateRange) => void;
  onClose: () => void;
}

const MODE_OPTIONS: {
  mode: DateRangeMode;
  label: string;
  description: string;
}[] = [
  { mode: 'day', label: 'Day', description: 'Single day view' },
  { mode: '7days', label: '7 Days', description: 'Last 7 days' },
  { mode: 'week', label: 'Week', description: 'Calendar week (Mon-Sun)' },
  { mode: 'month', label: 'Month', description: 'Calendar month' },
  { mode: '30days', label: '30 Days', description: 'Last 30 days' },
  { mode: '365days', label: '365 Days', description: 'Last 365 days' },
  { mode: 'year', label: 'Year', description: 'Calendar year' },
  { mode: 'alltime', label: 'All Time', description: 'All available data' },
  {
    mode: 'custom',
    label: 'Custom Range',
    description: 'Choose specific dates',
  },
];

export default function DateRangeModal({
  visible,
  currentMode,
  onSelectMode,
  onClose,
}: DateRangeModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    [key: string]: {
      selected: boolean;
      startingDay?: boolean;
      endingDay?: boolean;
      color?: string;
    };
  }>({});
  const [customRange, setCustomRange] = useState<{
    start?: string;
    end?: string;
  }>({});

  const styles = useThemedStyles((theme) => ({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end' as const,
    },
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.shadow,
    },
    modalContent: {
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: '80%' as const,
      minHeight: '50%' as const,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing.lg - 4,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg - 4,
      paddingTop: theme.spacing.md - 6,
      paddingBottom: theme.spacing.lg - 4,
    },
    modeGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between' as const,
    },
    modeOption: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.sm + 6,
      paddingHorizontal: theme.spacing.sm * 1.5,
      borderRadius: theme.borderRadius.md * 1.5,
      borderWidth: 1,
      marginVertical: theme.spacing.xs,
      width: '48%' as const,
    },
    modeContent: {
      flex: 1,
    },
    modeLabel: {
      fontSize: 15,
      fontWeight: '600' as const,
      marginBottom: 2,
    },
    modeDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    customActions: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm * 1.5,
      paddingTop: theme.spacing.lg - 4,
    },
    customButton: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: theme.spacing.sm + 6,
      borderRadius: theme.borderRadius.md * 1.5,
      gap: theme.spacing.xs + 2,
    },
    cancelButton: {
      flex: 0.4,
      backgroundColor: theme.colors.secondary,
    },
    confirmButton: {
      flex: 0.6,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600' as const,
    },
  }));

  const handleModeSelect = (mode: DateRangeMode) => {
    if (mode === 'custom') {
      setShowCustomPicker(true);
    } else {
      onSelectMode(mode);
      onClose();
    }
  };

  const handleDayPress = (day: any) => {
    const dateString = day.dateString;

    if (!customRange.start || (customRange.start && customRange.end)) {
      // Start new selection
      setCustomRange({ start: dateString });
      setSelectedDates({
        [dateString]: {
          selected: true,
          startingDay: true,
          color: colors.primary,
        },
      });
    } else if (customRange.start && !customRange.end) {
      // Complete the range
      const startDate = new Date(customRange.start);
      const endDate = new Date(dateString);

      if (endDate < startDate) {
        // If end is before start, swap them
        setCustomRange({ start: dateString, end: customRange.start });
        setSelectedDates({
          [dateString]: {
            selected: true,
            startingDay: true,
            color: colors.primary,
          },
          [customRange.start]: {
            selected: true,
            endingDay: true,
            color: colors.primary,
          },
        });
      } else {
        setCustomRange({ ...customRange, end: dateString });

        // Mark all dates in range
        const newSelectedDates: typeof selectedDates = {};
        const currentDate = new Date(customRange.start);
        const finalDate = new Date(dateString);

        while (currentDate <= finalDate) {
          const current = currentDate.toISOString().split('T')[0];
          newSelectedDates[current] = {
            selected: true,
            startingDay: current === customRange.start,
            endingDay: current === dateString,
            color: colors.primary,
          };
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setSelectedDates(newSelectedDates);
      }
    }
  };

  const handleCustomRangeConfirm = () => {
    if (customRange.start && customRange.end) {
      const dateRange: DateRange = {
        start: new Date(customRange.start),
        end: new Date(customRange.end),
      };
      onSelectMode('custom', dateRange);
      setShowCustomPicker(false);
      setCustomRange({});
      setSelectedDates({});
      onClose();
    }
  };

  const handleCustomRangeCancel = () => {
    setShowCustomPicker(false);
    setCustomRange({});
    setSelectedDates({});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalOverlay} onPress={onClose} />
        <View
          style={[
            styles.modalContent,
            {
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {showCustomPicker ? 'Select Custom Range' : 'Date Range'}
            </Text>
            <Pressable
              onPress={showCustomPicker ? handleCustomRangeCancel : onClose}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          {!showCustomPicker ? (
            // Mode Selection
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modeGrid}>
                {MODE_OPTIONS.map((option) => (
                  <Pressable
                    key={option.mode}
                    style={[
                      styles.modeOption,
                      {
                        backgroundColor:
                          currentMode === option.mode
                            ? colors.iconBackground.primary
                            : colors.card,
                        borderColor:
                          currentMode === option.mode
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                    onPress={() => handleModeSelect(option.mode)}
                  >
                    <View style={styles.modeContent}>
                      <Text
                        style={[
                          styles.modeLabel,
                          {
                            color:
                              currentMode === option.mode
                                ? colors.primary
                                : colors.text,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={styles.modeDescription}>
                        {option.description}
                      </Text>
                    </View>
                    {currentMode === option.mode && (
                      <Check size={16} color={colors.primary} />
                    )}
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : (
            // Custom Date Picker
            <View style={styles.content}>
              <Calendar
                onDayPress={handleDayPress}
                markingType="period"
                markedDates={selectedDates}
                theme={{
                  backgroundColor: colors.background,
                  calendarBackground: colors.background,
                  textSectionTitleColor: colors.textSecondary,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.background,
                  todayTextColor: colors.primary,
                  dayTextColor: colors.text,
                  textDisabledColor: colors.textSecondary,
                  arrowColor: colors.primary,
                  monthTextColor: colors.text,
                  indicatorColor: colors.primary,
                }}
              />

              {/* Custom Range Actions */}
              <View style={styles.customActions}>
                <Pressable
                  style={[styles.customButton, styles.cancelButton]}
                  onPress={handleCustomRangeCancel}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.customButton,
                    styles.confirmButton,
                    {
                      backgroundColor:
                        customRange.start && customRange.end
                          ? colors.primary
                          : colors.button.primaryBgDisabled,
                    },
                  ]}
                  onPress={handleCustomRangeConfirm}
                  disabled={!customRange.start || !customRange.end}
                >
                  <Check size={16} color={colors.button.primaryText} />
                  <Text
                    style={[
                      styles.buttonText,
                      { color: colors.button.primaryText },
                    ]}
                  >
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
