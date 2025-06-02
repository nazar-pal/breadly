import IconButton from '@/components/ui/IconButton';
import { useCategoryContext } from '@/context/CategoryContext';
import { useTheme } from '@/context/ThemeContext';
import {
  ChevronLeft,
  ChevronRight,
  LocationEdit as Edit2,
  X,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DateRangeModal from './DateRangeModal';

interface FinancialHeaderProps {
  totalExpenses: number;
  totalIncome: number;
  onManagePress: () => void;
}

export default function FinancialHeader({
  totalExpenses,
  totalIncome,
  onManagePress,
}: FinancialHeaderProps) {
  const { colors } = useTheme();
  const {
    activeTab,
    isEditMode,
    handleToggleEditMode,
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
    handleDateRangeModalClose,
  } = useCategoryContext();

  const netBalance = totalIncome - totalExpenses;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
          {isEditMode ? 'Edit Categories' : 'Net Balance'}
        </Text>
        <IconButton
          icon={isEditMode ? <X size={20} /> : <Edit2 size={20} />}
          variant="ghost"
          onPress={handleToggleEditMode || onManagePress}
        />
      </View>
      {!isEditMode && (
        <Text
          style={[
            styles.balanceAmount,
            {
              color: netBalance >= 0 ? colors.success : colors.error,
            },
          ]}
        >
          ${Math.abs(netBalance).toFixed(2)}
        </Text>
      )}

      {/* Date Range Selector */}
      {!isEditMode && (
        <View style={styles.dateSelector}>
          <Pressable
            onPress={navigatePrevious}
            disabled={!canNavigate}
            style={[styles.navButton, { opacity: canNavigate ? 1 : 0.3 }]}
          >
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>

          <Pressable
            onPress={handleDateRangePress}
            style={styles.dateRangeButton}
          >
            <Text style={[styles.dateRange, { color: colors.text }]}>
              {formattedRange}
            </Text>
            <Text
              style={[styles.modeIndicator, { color: colors.textSecondary }]}
            >
              {getModeDisplayName(mode)}
            </Text>
          </Pressable>

          <Pressable
            onPress={navigateNext}
            disabled={!canNavigate}
            style={[styles.navButton, { opacity: canNavigate ? 1 : 0.3 }]}
          >
            <ChevronRight size={24} color={colors.text} />
          </Pressable>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'expenses' && [
              styles.activeTab,
              { backgroundColor: colors.primary + '20' },
            ],
          ]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'expenses'
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Expenses
          </Text>
          <Text
            style={[
              styles.tabAmount,
              {
                color:
                  activeTab === 'expenses'
                    ? colors.error
                    : colors.textSecondary,
              },
            ]}
          >
            ${totalExpenses.toFixed(2)}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            activeTab === 'incomes' && [
              styles.activeTab,
              { backgroundColor: colors.primary + '20' },
            ],
          ]}
          onPress={() => setActiveTab('incomes')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'incomes'
                    ? colors.primary
                    : colors.textSecondary,
              },
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
                    : colors.textSecondary,
              },
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingVertical: 8,
  },
  navButton: {
    padding: 8,
  },
  dateRangeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dateRange: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  modeIndicator: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tabAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
