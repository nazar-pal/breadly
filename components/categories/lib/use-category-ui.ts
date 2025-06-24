import { useState } from 'react'
import { CategoryWithAmounts } from './use-get-categories-with-amounts'

export interface CategoryData {
  id: string
  name: string
  description: string | null
  icon: string
}

export function useCategoryUI() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [addTransactionModalVisible, setAddTransactionModalVisible] =
    useState(false)

  // Unified modal state
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryData | null>(
    null
  )

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
    setCategoryModalVisible(true)
  }

  const handleAddCategory = () => {
    setCategoryToEdit(null) // No category data means "add mode"
    setCategoryModalVisible(true)
  }

  const handleCloseCategoryModal = () => {
    setCategoryModalVisible(false)
    setCategoryToEdit(null)
  }

  return {
    // State
    selectedCategory,
    addTransactionModalVisible,
    categoryModalVisible,
    categoryToEdit,

    // Actions
    handleCategoryPress,
    handleCategoryLongPress,
    handleCloseAddTransactionModal,
    handleAddCategory,
    handleCloseCategoryModal
  }
}
