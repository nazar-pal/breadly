import { LocalStore } from '@/lib/storage/mmkv'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface LastSelectedItem {
  id: string | null
  from: 'account' | 'currency'
}

interface LastParamsState {
  expense: LastSelectedItem
  income: LastSelectedItem
}

interface LastParamsActions {
  setLastParams: (type: 'expense' | 'income', params: LastSelectedItem) => void
}

interface LastParamsStore extends LastParamsState, LastParamsActions {}

const INITIAL_STATE: LastParamsState = {
  expense: { id: null, from: 'account' },
  income: { id: null, from: 'account' }
}

export const lastParamsStore = create<LastParamsStore>()(
  persist(
    set => ({
      ...INITIAL_STATE,

      setLastParams: (type, params) => set({ [type]: params })
    }),
    {
      name: 'expense-income-last-params-storage',
      storage: createJSONStorage(() => LocalStore),
      version: 1,
      partialize: ({ expense, income }) => ({ expense, income })
    }
  )
)

export const useLastParams = lastParamsStore
