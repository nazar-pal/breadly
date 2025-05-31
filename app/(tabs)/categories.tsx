import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockCategories } from '@/data/mockData';
import CategoryCard from '@/components/categories/CategoryCard';
import CategoryForm from '@/components/categories/CategoryForm';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

export default function CategoriesScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState(mockCategories);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };

  const handleEditCategory = (id: string) => {
    setEditingCategory(id);
    setModalVisible(true);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleSubmitCategory = (data: { name: string; budget: string }) => {
    if (editingCategory) {
      // Edit existing category
      setCategories(
        categories.map((category) =>
          category.id === editingCategory
            ? {
                ...category,
                name: data.name,
                budget: parseFloat(data.budget),
              }
            : category
        )
      );
    } else {
      // Add new category
      const newCategory = {
        id: (categories.length + 1).toString(),
        name: data.name,
        budget: parseFloat(data.budget),
        spent: 0,
      };
      setCategories([...categories, newCategory]);
    }
    setModalVisible(false);
  };

  const getEditingCategoryData = () => {
    if (!editingCategory) return undefined;
    const category = categories.find((c) => c.id === editingCategory);
    if (!category) return undefined;
    return {
      name: category.name,
      budget: category.budget.toString(),
    };
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Categories
        </Text>
        <Button
          variant="primary"
          onPress={handleAddCategory}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
        >
          Add Category
        </Button>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
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

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card, borderRadius: 12 },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text, borderBottomColor: colors.border },
              ]}
            >
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </Text>
            <CategoryForm
              onSubmit={handleSubmitCategory}
              initialData={getEditingCategoryData()}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
  },
});