import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type CategoryDetailsState = {
  isCategoryDetailsModalOpen: boolean
  categoryDetailsSelectedCategory: string | null
}

type CategoryDetailsActions = {
  openCategoryDetailsModal: (categoryId: string) => void
  closeCategoryDetailsModal: () => void
}

export type CategoryDetailsStore = CategoryDetailsState & {
  actions: CategoryDetailsActions
}

export const categoryDetailsStore = create<CategoryDetailsStore>((set, get) => {
  return {
    // State
    categoryDetailsSelectedCategory: null,
    isCategoryDetailsModalOpen: false,

    // Actions
    actions: {
      openCategoryDetailsModal: (categoryId: string) =>
        set({
          categoryDetailsSelectedCategory: categoryId,
          isCategoryDetailsModalOpen: true
        }),
      closeCategoryDetailsModal: () =>
        set({
          isCategoryDetailsModalOpen: false,
          categoryDetailsSelectedCategory: null
        })
    }
  }
})

export const useCategoryDetailsState = () => {
  return categoryDetailsStore(
    useShallow(state => ({
      isCategoryDetailsModalOpen: state.isCategoryDetailsModalOpen,
      categoryDetailsSelectedCategory: state.categoryDetailsSelectedCategory
    }))
  )
}

export const useCategoryDetailsActions = () =>
  categoryDetailsStore(state => state.actions)
