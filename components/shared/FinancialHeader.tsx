import IconButton from '@/components/ui/IconButton';
import { useCategoryContext } from '@/context/CategoryContext';
import { useTheme, useThemedStyles } from '@/context/ThemeContext';
import {
  ChevronLeft,
  ChevronRight,
  LocationEdit as Edit2,
  X,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
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

  const styles = useThemedStyles((theme) => ({
    header: {
      padding: theme.spacing.md,
    },
    headerTop: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    balanceLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: '700' as const,
      marginVertical: theme.spacing.sm,
    },
    dateSelector: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginVertical: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    navButton: {
      padding: theme.spacing.sm,
    },
    dateRangeButton: {
      flex: 1,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.sm,
    },
    dateRange: {
      fontSize: 16,
      fontWeight: '600' as const,
      marginBottom: 2,
      color: theme.colors.text,
    },
    modeIndicator: {
      fontSize: 12,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      color: theme.colors.textSecondary,
    },
    tabContainer: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm * 1.5,
      marginTop: theme.spacing.sm,
    },
    tab: {
      flex: 1,
      padding: theme.spacing.sm * 1.5,
      borderRadius: theme.borderRadius.md * 1.5,
      alignItems: 'center' as const,
      backgroundColor: 'transparent',
    },
    activeTab: {
      backgroundColor: theme.colors.iconBackground.primary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600' as const,
      marginBottom: 2,
    },
    tabAmount: {
      fontSize: 13,
      fontWeight: '500' as const,
    },
  }));

  const netBalance = totalIncome - totalExpenses;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.balanceLabel}>
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
            <Text style={styles.dateRange}>{formattedRange}</Text>
            <Text style={styles.modeIndicator}>{getModeDisplayName(mode)}</Text>
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
