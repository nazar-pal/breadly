import { LocalStore } from '@/lib/storage/mmkv'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ArchivedCategoriesStore = {
  isExpanded: boolean
  setExpanded: (value: boolean) => void
  toggle: () => void
}

export const useArchivedCategoriesExpanded = create<ArchivedCategoriesStore>()(
  persist(
    set => ({
      isExpanded: false,
      setExpanded: (value: boolean) => set({ isExpanded: value }),
      toggle: () => set(state => ({ isExpanded: !state.isExpanded }))
    }),
    {
      name: 'categories-archived-expanded',
      storage: createJSONStorage(() => LocalStore)
    }
  )
)
