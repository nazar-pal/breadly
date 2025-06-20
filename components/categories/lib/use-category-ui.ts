import { useState } from 'react'
import { CategoryWithAmounts } from './use-get-categories-with-amounts'

export interface CategoryToEdit {
  id: string
  name: string
  description: string | null
  icon: string
}

export function useCategoryUI() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [addTransactionModalVisible, setAddTransactionModalVisible] =
    useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryToEdit | null>(
    null
  )
  const [addModalVisible, setAddModalVisible] = useState(false)

  // Actions
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setAddTransactionModalVisible(true)
  }

  const handleCloseAddTransactionModal = () => {
    setAddTransactionModalVisible(false)
    setSelectedCategory(null)
  }

  const handleCategoryLongPress = (category: CategoryWithAmounts) => {
    setCategoryToEdit({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon
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
    addTransactionModalVisible,
    editModalVisible,
    categoryToEdit,
    addModalVisible,

    // Actions
    handleCategoryPress,
    handleCategoryLongPress,
    handleCloseAddTransactionModal,
    handleCloseEditModal,
    handleAddCategory,
    handleCloseAddModal
  }
}
