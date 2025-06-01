import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockCategories } from '@/data/mockData';
import CategoryCard from '@/components/categories/CategoryCard';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react-native';

export default function ExpenseCategoriesScreen() {
  const { colors } = useTheme();
  const [categories, setCategories] = useState(mockCategories);

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