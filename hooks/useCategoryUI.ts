import { useState } from 'react'

export interface CategoryToEdit {
  id: string
  name: string
  description?: string
}

export function useCategoryUI() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes'>('expenses')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryToEdit | null>(
    null
  )
  const [addModalVisible, setAddModalVisible] = useState(false)

  // Derived state
  const currentType: 'expense' | 'income' =
    activeTab === 'expenses' ? 'expense' : 'income'

  // Actions
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedCategory(null)
  }

  const handleCategoryLongPress = (
    categoryId: string,
    categoryName: string
  ) => {
    setCategoryToEdit({
      id: categoryId,
      name: categoryName,
      description: ''
    })
    setEditModalVisible(true)
  }

  const handleCloseEditModal = () => {
    setEditModalVisible(false)
    setCategoryToEdit(null)
  }

  const handleAddCategory = () => {
    setAddModalVisible(true)
  }

  const handleCloseAddModal = () => {
    setAddModalVisible(false)
  }

  return {
    // State
    selectedCategory,
    modalVisible,
    activeTab,
    editModalVisible,
    categoryToEdit,
    addModalVisible,
    currentType,

    // Actions
    setActiveTab,
    handleCategoryPress,
    handleCategoryLongPress,
    handleCloseModal,
    handleCloseEditModal,
    handleAddCategory,
    handleCloseAddModal
  }
}
