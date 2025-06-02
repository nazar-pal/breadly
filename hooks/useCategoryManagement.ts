import { mockCategories, mockIncomeCategories } from '@/data/mockData';
import { useState } from 'react';
import { useDateRange } from './useDateRange';

export interface CategoryToEdit {
  id: string;
  name: string;
  description?: string;
}

export function useCategoryManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes'>(
    'expenses',
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryToEdit | null>(
    null,
  );
  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);

  // Date range management
  const dateRange = useDateRange();

  // Derived state
  const currentCategories =
    activeTab === 'expenses' ? mockCategories : mockIncomeCategories;
  const currentType: 'expense' | 'income' =
    activeTab === 'expenses' ? 'expense' : 'income';

  // Actions
  const handleCategoryPress = (categoryName: string) => {
    if (isEditMode) {
      const category = currentCategories.find(
        (cat) => cat.name === categoryName,
      );
      if (category) {
        setCategoryToEdit({
          id: category.id,
          name: category.name,
          description: '',
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

  // Date range actions
  const handleDateRangePress = () => {
    setDateRangeModalVisible(true);
  };

  const handleDateRangeModalClose = () => {
    setDateRangeModalVisible(false);
  };

  return {
    // State
    selectedCategory,
    modalVisible,
    activeTab,
    isEditMode,
    editModalVisible,
    categoryToEdit,
    currentCategories,
    currentType,
    dateRangeModalVisible,

    // Date range state
    ...dateRange,

    // Actions
    setActiveTab,
    handleCategoryPress,
    handleSubmit,
    handleCloseModal,
    handleToggleEditMode,
    handleSaveCategory,
    handleCloseEditModal,
    handleDateRangePress,
    handleDateRangeModalClose,
  };
}
