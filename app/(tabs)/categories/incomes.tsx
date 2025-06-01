import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import CategoryCard from '@/components/categories/CategoryCard';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react-native';

const mockIncomeCategories = [
  {
    id: '1',
    name: 'Salary',
    budget: 5000.0,
    spent: 5000.0,
  },
  {
    id: '2',
    name: 'Freelance',
    budget: 2000.0,
    spent: 1500.0,
  },
  {
    id: '3',
    name: 'Investments',
    budget: 1000.0,
    spent: 750.0,
  },
  {
    id: '4',
    name: 'Side Projects',
    budget: 500.0,
    spent: 300.0,
  },
];

export default function IncomeCategoriesScreen() {
  const { colors } = useTheme();
  const [categories, setCategories] = useState(mockIncomeCategories);

  const handleAddCategory = () => {
    // TODO: Implement add category
  };

  const handleEditCategory = (id: string) => {
    // TODO: Implement edit category
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Button
          variant="primary"
          onPress={handleAddCategory}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
        >
          Add Category
        </Button>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            type="income"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});