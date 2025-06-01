import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Card from '../ui/Card';
import { useTheme } from '@/context/ThemeContext';
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import IconButton from '../ui/IconButton';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    budget: number;
    spent: number;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const { colors, spacing } = useTheme();

  const percentage = (category.spent / category.budget) * 100;
  const isOverBudget = percentage > 100;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>
          {category.name}
        </Text>
        <View style={styles.actions}>
          <IconButton
            icon={<Edit2 size={16} />}
            variant="ghost"
            size="sm"
            onPress={() => onEdit(category.id)}
            style={{ marginRight: spacing.xs }}
          />
          <IconButton
            icon={<Trash2 size={16} />}
            variant="ghost"
            size="sm"
            onPress={() => onDelete(category.id)}
          />
        </View>
      </View>

      <View style={styles.budgetContainer}>
        <View style={styles.budgetInfo}>
          <Text style={[styles.spent, { color: colors.text }]}>
            ${category.spent.toFixed(2)}
          </Text>
          <Text style={[styles.budgetText, { color: colors.textSecondary }]}>
            of ${category.budget.toFixed(2)}
          </Text>
        </View>
        <Text
          style={[
            styles.percentage,
            { color: isOverBudget ? colors.error : colors.success },
          ]}
        >
          {percentage.toFixed(0)}%
        </Text>
      </View>

      <View
        style={[
          styles.progressBarContainer,
          { backgroundColor: colors.secondary },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isOverBudget ? colors.error : colors.success,
            },
          ]}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spent: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 4,
  },
  budgetText: {
    fontSize: 14,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});
