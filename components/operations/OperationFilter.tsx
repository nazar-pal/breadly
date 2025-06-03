import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type FilterOption = 'all' | 'expenses' | 'income';

interface OperationFilterProps {
  selected: FilterOption;
  onSelect: (filter: FilterOption) => void;
}

export default function OperationFilter({ selected, onSelect }: OperationFilterProps) {
  const { colors } = useTheme();

  const filters: FilterOption[] = ['all', 'expenses', 'income'];

  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            selected === filter && { backgroundColor: colors.primary },
          ]}
          onPress={() => onSelect(filter)}
        >
          <Text
            style={[
              styles.filterText,
              { color: selected === filter ? '#fff' : colors.textSecondary },
            ]}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});