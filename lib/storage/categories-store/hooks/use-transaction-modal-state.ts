import { useShallow } from 'zustand/shallow'
import { categoriesStore } from '../categories-store'

export const useTransactionModalState = () => {
  return categoriesStore(
    useShallow(state => ({
      isAddTransactionModalOpen: state.isAddTransactionModalOpen,
      selectedCategory: state.selectedCategory
    }))
  )
}
