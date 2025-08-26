import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

/**
 * Category Form Modal Store
 *
 * This store manages the state for the category form modal with the following scenarios:
 * - If both parentId and categoryId are null: creating a new root category
 * - If categoryId is null but parentId is string: creating a new subcategory of that parent
 * - If categoryId is string: updating an existing category (parentId is ignored)
 * - If both categoryId and parentId are string: treated the same as categoryId string and parentId null
 */

type CategoryFormModalState = {
  isModalOpen: boolean
  isIconModalOpen: boolean
  categoryId: string | null
  parentId: string | null
  type: 'expense' | 'income'
  isUpdating: boolean
}

type OpenCategoryFormModalParams = Pick<
  CategoryFormModalState,
  'parentId' | 'categoryId' | 'type'
>

type CategoryFormModalActions = {
  openCategoryFormModal: (params: OpenCategoryFormModalParams) => void
  openIconModal: (params: OpenCategoryFormModalParams) => void
  closeCategoryFormModal: () => void
}

export type CategoryFormModalStore = CategoryFormModalState & {
  actions: CategoryFormModalActions
}

const INITIAL_STATE: CategoryFormModalState = {
  isModalOpen: false,
  isIconModalOpen: false,
  categoryId: null,
  parentId: null,
  type: 'expense',
  isUpdating: false
}

export const categoryFormModalStore = create<CategoryFormModalStore>(set => {
  return {
    // State
    ...INITIAL_STATE,

    // Actions
    actions: {
      openCategoryFormModal: (params: OpenCategoryFormModalParams) =>
        set({
          ...params,
          isModalOpen: true,
          isUpdating: params.categoryId !== null
        }),
      openIconModal: (params: OpenCategoryFormModalParams) =>
        set({
          ...params,
          isIconModalOpen: true
        }),
      closeCategoryFormModal: () => set(INITIAL_STATE)
    }
  }
})

export const useCategoryFormModalState = () => {
  return categoryFormModalStore(
    useShallow(state => ({
      isModalOpen: state.isModalOpen,
      isIconModalOpen: state.isIconModalOpen,
      categoryId: state.categoryId,
      parentId: state.parentId,
      isUpdating: state.isUpdating
    }))
  )
}

export const useCategoryFormModalActions = () =>
  categoryFormModalStore(state => state.actions)
