import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type AddTransactionState = {
  isAddTransactionModalOpen: boolean
  addTransactionSelectedCategory: string | null
}

type AddTransactionActions = {
  openAddTransactionModal: (categoryId: string) => void
  closeAddTransactionModal: () => void
  setCategoryForTransaction: (categoryId: string) => void
}

export type AddTransactionStore = AddTransactionState & {
  actions: AddTransactionActions
}

export const addTransactionStore = create<AddTransactionStore>((set, get) => {
  return {
    // State
    addTransactionSelectedCategory: null,
    isAddTransactionModalOpen: false,

    // Actions
    actions: {
      setCategoryForTransaction: (categoryId: string) =>
        set({ addTransactionSelectedCategory: categoryId }),
      openAddTransactionModal: (categoryId: string) =>
        set({
          addTransactionSelectedCategory: categoryId,
          isAddTransactionModalOpen: true
        }),
      closeAddTransactionModal: () =>
        set({
          isAddTransactionModalOpen: false,
          addTransactionSelectedCategory: null
        })
    }
  }
})

export const useAddTransactionState = () => {
  return addTransactionStore(
    useShallow(state => ({
      isAddTransactionModalOpen: state.isAddTransactionModalOpen,
      addTransactionSelectedCategory: state.addTransactionSelectedCategory
    }))
  )
}

export const useAddTransactionActions = () =>
  addTransactionStore(state => state.actions)
