import { router } from 'expo-router'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type CategoryDetailsState = {
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

    // Actions
    actions: {
      openCategoryDetailsModal: (categoryId: string) => {
        router.push(`/category-details`)
        set({
          categoryDetailsSelectedCategory: categoryId
        })
      },
      closeCategoryDetailsModal: () => {
        router.back()
        set({
          categoryDetailsSelectedCategory: null
        })
      }
    }
  }
})

export const useCategoryDetailsState = () => {
  return categoryDetailsStore(
    useShallow(state => ({
      categoryDetailsSelectedCategory: state.categoryDetailsSelectedCategory
    }))
  )
}

export const useCategoryDetailsActions = () =>
  categoryDetailsStore(state => state.actions)
