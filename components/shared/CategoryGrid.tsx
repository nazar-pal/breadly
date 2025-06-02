import { useCategoryContext } from '@/context/CategoryContext';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
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
    isEditMode,
    activeTab,
    handleCategoryPress,
    handleToggleEditMode,
  } = useCategoryContext();

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
            isEditMode={isEditMode}
          />
        );
      })}

      {!isEditMode && (
        <AddCategoryButton
          onPress={handleToggleEditMode}
          label={activeTab === 'expenses' ? 'Add' : 'Add Category'}
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
