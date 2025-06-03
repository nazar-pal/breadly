import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface OperationFilterProps {
  selected: 'all' | 'expenses' | 'income';
  onSelect: (filter: 'all' | 'expenses' | 'income') => void;
}

export default function OperationFilter({ selected, onSelect }: OperationFilterProps) {
  const { colors } = useTheme();

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'income', label: 'Income' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <Pressable
            key={filter.id}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selected === filter.id ? colors.primary : colors.secondary,
              },
            ]}
            onPress={() => onSelect(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: selected === filter.id ? '#FFFFFF' : colors.text,
                },
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});