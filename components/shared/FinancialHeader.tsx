import { useCategoryContext } from '@/context/CategoryContext'
import { useTheme, useThemedStyles } from '@/context/ThemeContext'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import DateRangeModal from './DateRangeModal'

interface FinancialHeaderProps {
  totalExpenses: number
  totalIncome: number
}

export default function FinancialHeader({
  totalExpenses,
  totalIncome
}: FinancialHeaderProps) {
  const { colors } = useTheme()
  const {
    activeTab,
    setActiveTab,
    // Date range
    formattedRange,
    canNavigate,
    navigatePrevious,
    navigateNext,
    mode,
    setMode,
    getModeDisplayName,
    dateRangeModalVisible,
    handleDateRangePress,
    handleDateRangeModalClose
  } = useCategoryContext()

  const styles = useThemedStyles(theme => ({
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm
    },
    topRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: theme.spacing.sm
    },
    leftSection: {
      flex: 1
    },
    balanceLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 2
    },
    balanceAmount: {
      fontSize: 24,
      fontWeight: '700' as const
    },
    rightSection: {
      alignItems: 'flex-end' as const
    },
    dateRange: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.colors.text,
      textAlign: 'right' as const
    },
    modeIndicator: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      marginTop: 1
    },
    tabContainer: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center' as const,
      backgroundColor: 'transparent',
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.sm
    },
    activeTab: {
      backgroundColor: theme.colors.iconBackground.primary,
      borderWidth: 1,
      borderColor: theme.colors.primary
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600' as const,
      marginBottom: 1
    },
    tabAmount: {
      fontSize: 14,
      fontWeight: '500' as const
    }
  }))

  const netBalance = totalIncome - totalExpenses

  return (
    <View style={styles.header}>
      {/* Top Row: Balance and Date Range */}
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <Text style={styles.balanceLabel}>Net Balance</Text>
          <Text
            style={[
              styles.balanceAmount,
              {
                color: netBalance >= 0 ? colors.success : colors.error
              }
            ]}
          >
            ${Math.abs(netBalance).toFixed(2)}
          </Text>
        </View>

        <Pressable onPress={handleDateRangePress} style={styles.rightSection}>
          <Text style={styles.dateRange}>{formattedRange}</Text>
          <Text style={styles.modeIndicator}>{getModeDisplayName(mode)}</Text>
        </Pressable>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'expenses'
                    ? colors.primary
                    : colors.textSecondary
              }
            ]}
          >
            Expenses
          </Text>
          <Text
            style={[
              styles.tabAmount,
              {
                color:
                  activeTab === 'expenses' ? colors.error : colors.textSecondary
              }
            ]}
          >
            ${totalExpenses.toFixed(2)}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'incomes' && styles.activeTab]}
          onPress={() => setActiveTab('incomes')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'incomes'
                    ? colors.primary
                    : colors.textSecondary
              }
            ]}
          >
            Income
          </Text>
          <Text
            style={[
              styles.tabAmount,
              {
                color:
                  activeTab === 'incomes'
                    ? colors.success
                    : colors.textSecondary
              }
            ]}
          >
            ${totalIncome.toFixed(2)}
          </Text>
        </Pressable>
      </View>

      {/* Date Range Modal */}
      <DateRangeModal
        visible={dateRangeModalVisible}
        currentMode={mode}
        onSelectMode={setMode}
        onClose={handleDateRangeModalClose}
        canNavigate={canNavigate}
        navigatePrevious={navigatePrevious}
        navigateNext={navigateNext}
        formattedRange={formattedRange}
      />
    </View>
  )
}
