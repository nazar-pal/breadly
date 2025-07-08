import { MMKV } from 'react-native-mmkv'
import { create } from 'zustand'

const storage = new MMKV({
  id: 'category-view-store'
})

export type CategoryViewType = 'compact' | 'extended'

interface CategoryViewState {
  viewType: CategoryViewType
}

interface CategoryViewActions {
  setViewType: (viewType: CategoryViewType) => void
  toggleViewType: () => void
}

export const useCategoryViewStore = create<
  CategoryViewState & CategoryViewActions
>((set, get) => ({
  // Initial state - get from storage or default to compact
  viewType:
    (storage.getString('category.viewType') as CategoryViewType) || 'compact',

  // Actions
  setViewType: (viewType: CategoryViewType) => {
    storage.set('category.viewType', viewType)
    set({ viewType })
  },

  toggleViewType: () => {
    const currentViewType = get().viewType
    const newViewType = currentViewType === 'compact' ? 'extended' : 'compact'
    storage.set('category.viewType', newViewType)
    set({ viewType: newViewType })
  }
}))
