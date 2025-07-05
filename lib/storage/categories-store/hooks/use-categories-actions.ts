import { categoriesStore } from '../categories-store'

export const useCategoriesActions = () =>
  categoriesStore(state => state.actions)
