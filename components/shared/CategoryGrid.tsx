import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AddCategoryButton from './AddCategoryButton';
import CategoryCard from './CategoryCard';

interface CategoryData {
  id: string;
  name: string;
  spent?: number;
  earned?: number;
}

interface CategoryGridProps {
  categories: CategoryData[];
  type: 'expense' | 'income';
  getIcon: (categoryName: string) => React.ReactNode;
  onCategoryPress: (categoryName: string) => void;
  onAddCategoryPress: () => void;
  showAddButton?: boolean;
  addButtonLabel?: string;
}

export default function CategoryGrid({
  categories,
  type,
  getIcon,
  onCategoryPress,
  onAddCategoryPress,
  showAddButton = true,
  addButtonLabel,
}: CategoryGridProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.gridContainer}
    >
      {categories.map((category) => {
        const amount =
          type === 'expense' ? (category.spent ?? 0) : (category.earned ?? 0);

        return (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            amount={amount}
            icon={getIcon(category.name)}
            type={type}
            onPress={onCategoryPress}
          />
        );
      })}

      {showAddButton && (
        <AddCategoryButton
          onPress={onAddCategoryPress}
          label={addButtonLabel}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
