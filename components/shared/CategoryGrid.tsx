import { useCategoryContext } from '@/context/CategoryContext';
import { useThemedStyles } from '@/context/ThemeContext';
import React from 'react';
import { ScrollView } from 'react-native';
import AddCategoryButton from './AddCategoryButton';
import CategoryCard from './CategoryCard';

interface CategoryGridProps {
  getIcon: (
    categoryName: string,
    type: 'expense' | 'income',
  ) => React.ReactNode;
}

export default function CategoryGrid({ getIcon }: CategoryGridProps) {
  const {
    currentCategories,
    currentType,
    activeTab,
    handleCategoryPress,
    handleCategoryLongPress,
  } = useCategoryContext();

  const styles = useThemedStyles((theme) => ({
    scrollView: {
      flex: 1,
    },
    gridContainer: {
      padding: theme.spacing.md,
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: theme.spacing.sm * 1.5,
    },
  }));

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.gridContainer}
    >
      {currentCategories.map((category) => {
        const amount =
          currentType === 'expense'
            ? 'spent' in category
              ? category.spent
              : 0
            : 'earned' in category
              ? category.earned
              : 0;

        return (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            amount={amount}
            icon={getIcon(category.name, currentType)}
            type={currentType}
            onPress={handleCategoryPress}
            onLongPress={handleCategoryLongPress}
          />
        );
      })}

      <AddCategoryButton
        onPress={() => {}} // TODO: Implement add category functionality
        label={activeTab === 'expenses' ? 'Add' : 'Add Category'}
      />
    </ScrollView>
  );
}
