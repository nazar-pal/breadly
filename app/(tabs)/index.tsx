import { useTheme } from '@/context/ThemeContext';
import { mockExpenses, mockIncomes } from '@/data/mockData';
import { Filter, SortAsc, SortDesc } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DateRangeModal from '@/components/shared/DateRangeModal';
import { DateRange, DateRangeMode } from '@/hooks/useDateRange';

// Combine all operations and add type identifier
const allOperations = [
  ...mockExpenses.map((expense) => ({ ...expense, operationType: 'expense' })),
  ...mockIncomes.map((income) => ({ ...income, operationType: 'income' })),
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

type FilterState = {
  operationType: string[];
  dateRange: DateRange | null;
  minAmount: number | null;
  maxAmount: number | null;
  categories: string[];
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
};

function OperationCard({ operation }: { operation: any }) {
  const { colors } = useTheme();
  const isExpense = operation.operationType === 'expense';

  return (
    <Card style={styles.operationCard}>
      <View style={styles.operationHeader}>
        <Text style={[styles.amount, { color: isExpense ? colors.error : colors.success }]}>
          {isExpense ? '-' : '+'}${operation.amount.toFixed(2)}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.typeText, { color: colors.text }]}>
            {operation.operationType.charAt(0).toUpperCase() + operation.operationType.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={[styles.description, { color: colors.text }]}>
        {operation.description}
      </Text>
      <View style={styles.operationFooter}>
        <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.categoryText, { color: colors.text }]}>
            {operation.category}
          </Text>
        </View>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(operation.date).toLocaleDateString()}
        </Text>
      </View>
    </Card>
  );
}

function FilterModal({
  visible,
  filters,
  onClose,
  onApply,
}: {
  visible: boolean;
  filters: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}) {
  const { colors } = useTheme();
  const [tempFilters, setTempFilters] = useState(filters);
  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);

  const operationTypes = ['expense', 'income', 'debt'];
  const categories = Array.from(
    new Set([...mockExpenses, ...mockIncomes].map((op) => op.category)),
  );

  const toggleOperationType = (type: string) => {
    setTempFilters((prev) => ({
      ...prev,
      operationType: prev.operationType.includes(type)
        ? prev.operationType.filter((t) => t !== type)
        : [...prev.operationType, type],
    }));
  };

  const toggleCategory = (category: string) => {
    setTempFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleDateRangeSelect = (mode: DateRangeMode, customRange?: DateRange) => {
    if (customRange) {
      setTempFilters((prev) => ({
        ...prev,
        dateRange: customRange,
      }));
    }
    setDateRangeModalVisible(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <Button variant="outline" onPress={onClose}>
              Close
            </Button>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>
                Operation Type
              </Text>
              <View style={styles.filterOptions}>
                {operationTypes.map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: tempFilters.operationType.includes(type)
                          ? colors.primary
                          : colors.card,
                      },
                    ]}
                    onPress={() => toggleOperationType(type)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color: tempFilters.operationType.includes(type)
                            ? '#FFFFFF'
                            : colors.text,
                        },
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>
                Date Range
              </Text>
              <Button
                variant="outline"
                onPress={() => setDateRangeModalVisible(true)}
              >
                Select Date Range
              </Button>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>
                Categories
              </Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <Pressable
                    key={category}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: tempFilters.categories.includes(category)
                          ? colors.primary
                          : colors.card,
                      },
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color: tempFilters.categories.includes(category)
                            ? '#FFFFFF'
                            : colors.text,
                        },
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Sort</Text>
              <View style={styles.sortOptions}>
                <Button
                  variant={tempFilters.sortBy === 'date' ? 'primary' : 'outline'}
                  onPress={() =>
                    setTempFilters((prev) => ({ ...prev, sortBy: 'date' }))
                  }
                  style={{ flex: 1, marginRight: 8 }}
                >
                  Date
                </Button>
                <Button
                  variant={tempFilters.sortBy === 'amount' ? 'primary' : 'outline'}
                  onPress={() =>
                    setTempFilters((prev) => ({ ...prev, sortBy: 'amount' }))
                  }
                  style={{ flex: 1 }}
                >
                  Amount
                </Button>
              </View>
              <View style={[styles.sortOptions, { marginTop: 8 }]}>
                <Button
                  variant={tempFilters.sortOrder === 'asc' ? 'primary' : 'outline'}
                  onPress={() =>
                    setTempFilters((prev) => ({ ...prev, sortOrder: 'asc' }))
                  }
                  style={{ flex: 1, marginRight: 8 }}
                >
                  Ascending
                </Button>
                <Button
                  variant={tempFilters.sortOrder === 'desc' ? 'primary' : 'outline'}
                  onPress={() =>
                    setTempFilters((prev) => ({ ...prev, sortOrder: 'desc' }))
                  }
                  style={{ flex: 1 }}
                >
                  Descending
                </Button>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              variant="primary"
              onPress={() => {
                onApply(tempFilters);
                onClose();
              }}
            >
              Apply Filters
            </Button>
          </View>
        </View>
      </View>

      <DateRangeModal
        visible={dateRangeModalVisible}
        currentMode="custom"
        onSelectMode={handleDateRangeSelect}
        onClose={() => setDateRangeModalVisible(false)}
      />
    </Modal>
  );
}

export default function OperationsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    operationType: ['expense', 'income'],
    dateRange: null,
    minAmount: null,
    maxAmount: null,
    categories: [],
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const filteredOperations = allOperations
    .filter((operation) => {
      // Filter by operation type
      if (!filters.operationType.includes(operation.operationType)) return false;

      // Filter by date range
      if (filters.dateRange) {
        const opDate = new Date(operation.date);
        if (
          opDate < filters.dateRange.start ||
          opDate > filters.dateRange.end
        )
          return false;
      }

      // Filter by categories
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(operation.category)
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return filters.sortOrder === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
    });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Operations
        </Text>
        <Button
          variant="outline"
          onPress={() => setFilterModalVisible(true)}
          leftIcon={<Filter size={20} color={colors.text} />}
        >
          Filter
        </Button>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom },
        ]}
      >
        {filteredOperations.map((operation) => (
          <OperationCard key={operation.id} operation={operation} />
        ))}
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  operationCard: {
    marginBottom: 12,
  },
  operationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  operationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortOptions: {
    flexDirection: 'row',
  },
});