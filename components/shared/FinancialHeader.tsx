import { useCategoryContext } from '@/context/CategoryContext'
import { useTheme } from '@/context/ThemeContext'
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

  const netBalance = totalIncome - totalExpenses

  return (
    <View className="px-4 py-2">
      {/* Top Row: Balance and Date Range */}
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            className="mb-0.5 text-xs"
            style={{ color: colors.textSecondary }}
          >
            Net Balance
          </Text>
          <Text
            className="text-2xl font-bold"
            style={{
              color: netBalance >= 0 ? colors.success : colors.error
            }}
          >
            ${Math.abs(netBalance).toFixed(2)}
          </Text>
        </View>

        <Pressable onPress={handleDateRangePress} className="items-end">
          <Text
            className="text-right text-sm font-semibold"
            style={{ color: colors.text }}
          >
            {formattedRange}
          </Text>
          <Text
            className="mt-0.5 text-[10px] uppercase tracking-wider"
            style={{ color: colors.textSecondary }}
          >
            {getModeDisplayName(mode)}
          </Text>
        </Pressable>
      </View>

      {/* Tab Navigation */}
      <View className="mt-1 flex-row gap-2">
        <Pressable
          className="mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2"
          style={{
            backgroundColor:
              activeTab === 'expenses'
                ? colors.iconBackground.primary
                : 'transparent',
            borderWidth: activeTab === 'expenses' ? 1 : 0,
            borderColor:
              activeTab === 'expenses' ? colors.primary : 'transparent'
          }}
          onPress={() => setActiveTab('expenses')}
        >
          <Text
            className="mb-0.5 text-base font-semibold"
            style={{
              color:
                activeTab === 'expenses' ? colors.primary : colors.textSecondary
            }}
          >
            Expenses
          </Text>
          <Text
            className="text-sm font-medium"
            style={{
              color:
                activeTab === 'expenses' ? colors.error : colors.textSecondary
            }}
          >
            ${totalExpenses.toFixed(2)}
          </Text>
        </Pressable>

        <Pressable
          className="mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2"
          style={{
            backgroundColor:
              activeTab === 'incomes'
                ? colors.iconBackground.primary
                : 'transparent',
            borderWidth: activeTab === 'incomes' ? 1 : 0,
            borderColor:
              activeTab === 'incomes' ? colors.primary : 'transparent'
          }}
          onPress={() => setActiveTab('incomes')}
        >
          <Text
            className="mb-0.5 text-base font-semibold"
            style={{
              color:
                activeTab === 'incomes' ? colors.primary : colors.textSecondary
            }}
          >
            Income
          </Text>
          <Text
            className="text-sm font-medium"
            style={{
              color:
                activeTab === 'incomes' ? colors.success : colors.textSecondary
            }}
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
