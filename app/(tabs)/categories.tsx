import CalculatorModal from '@/components/shared/CalculatorModal';
import CategoryEditModal from '@/components/shared/CategoryEditModal';
import CategoryGrid from '@/components/shared/CategoryGrid';
import FinancialHeader from '@/components/shared/FinancialHeader';
import { useTheme } from '@/context/ThemeContext';
import { mockCategories, mockIncomeCategories } from '@/data/mockData';
import {
  Briefcase,
  Building,
  Bus,
  Coffee,
  DollarSign,
  Film,
  Heart,
  Home,
  PiggyBank,
  Shirt,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Map category names to icons for expenses
const categoryIcons: { [key: string]: React.ComponentType<any> } = {
  Coffee: Coffee,
  Dining: UtensilsCrossed,
  Entertainment: Film,
  Transportation: Bus,
  Health: Heart,
  Home: Home,
  Family: Users,
  Shopping: Shirt,
};

// Map income category names to icons
const incomeCategoryIcons: { [key: string]: React.ComponentType<any> } = {
  Salary: Briefcase,
  Freelance: DollarSign,
  Investment: TrendingUp,
  Business: Building,
  Rental: Home,
  'Side Hustle': Target,
  Other: PiggyBank,
};

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes'>(
    'expenses',
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<{
    id: string;
    name: string;
    description?: string;
  } | null>(null);

  // Mock data - in real app these would come from state/API
  const totalExpenses = 1845;
  const totalIncome = 6750;

  const handleCategoryPress = (categoryName: string) => {
    if (isEditMode) {
      // Find the category to edit
      const categories =
        activeTab === 'expenses' ? mockCategories : mockIncomeCategories;
      const category = categories.find((cat) => cat.name === categoryName);
      if (category) {
        setCategoryToEdit({
          id: category.id,
          name: category.name,
          description: '', // Add description field to mock data if needed
        });
        setEditModalVisible(true);
      }
    } else {
      setSelectedCategory(categoryName);
      setModalVisible(true);
    }
  };

  const handleSubmit = (data: any) => {
    console.log(`New ${activeTab.slice(0, -1)}:`, data);
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveCategory = (data: {
    id: string;
    name: string;
    description: string;
    iconName: string;
  }) => {
    console.log('Save category:', data);
    // TODO: Update the category in your state/API
    setEditModalVisible(false);
    setCategoryToEdit(null);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setCategoryToEdit(null);
  };

  const navigateToManageCategories = () => {
    return;
  };

  const getCategoryIcon = (categoryName: string) => {
    const icons =
      activeTab === 'expenses' ? categoryIcons : incomeCategoryIcons;
    const IconComponent = icons[categoryName] || Home;
    return <IconComponent size={20} color={colors.text} />;
  };

  const currentCategories =
    activeTab === 'expenses' ? mockCategories : mockIncomeCategories;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <FinancialHeader
        totalExpenses={totalExpenses}
        totalIncome={totalIncome}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dateRange="26 Jun - 01 Jul 2025"
        onManagePress={navigateToManageCategories}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
      />

      <CategoryGrid
        categories={currentCategories}
        type={activeTab === 'expenses' ? 'expense' : 'income'}
        getIcon={getCategoryIcon}
        onCategoryPress={handleCategoryPress}
        onAddCategoryPress={handleToggleEditMode}
        showAddButton={!isEditMode}
        addButtonLabel={activeTab === 'expenses' ? 'Add' : 'Add Category'}
        isEditMode={isEditMode}
      />

      <CalculatorModal
        visible={modalVisible}
        type={activeTab === 'expenses' ? 'expense' : 'income'}
        category={selectedCategory}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />

      <CategoryEditModal
        visible={editModalVisible}
        category={categoryToEdit}
        type={activeTab === 'expenses' ? 'expense' : 'income'}
        onSave={handleSaveCategory}
        onClose={handleCloseEditModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
