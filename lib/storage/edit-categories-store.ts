import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type EditCategoriesState = {
  showArchived: boolean
}

type EditCategoriesActions = {
  toggleArchive: () => void
}

export type EditCategoriesStore = EditCategoriesState & {
  actions: EditCategoriesActions
}

export const editCategoriesStore = create<EditCategoriesStore>(set => {
  return {
    // State
    showArchived: false,

    // Actions
    actions: {
      toggleArchive: () =>
        set(state => ({
          showArchived: !state.showArchived
        }))
    }
  }
})

export const useEditCategoriesState = () => {
  return editCategoriesStore(
    useShallow(state => ({
      showArchived: state.showArchived
    }))
  )
}

export const useEditCategoriesActions = () =>
  editCategoriesStore(state => state.actions)
