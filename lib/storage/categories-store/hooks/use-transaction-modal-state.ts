import { useShallow } from 'zustand/shallow'
import { categoriesStore } from '../categories-store'

export const useTransactionModalState = () => {
  return categoriesStore(
    useShallow(state => ({
      addTransactionModalVisible: state.addTransactionModalVisible,
      selectedCategory: state.selectedCategory
    }))
  )
}
