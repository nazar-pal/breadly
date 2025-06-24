import { useCategoryUI } from '@/components/categories/lib/use-category-ui'
import React, { createContext } from 'react'

export const CategoriesContext = createContext<{
  categoryUI: ReturnType<typeof useCategoryUI>
}>({
  categoryUI: {} as ReturnType<typeof useCategoryUI>
})

export function CategoriesContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const categoryUI = useCategoryUI()

  return (
    <CategoriesContext.Provider value={{ categoryUI }}>
      {children}
    </CategoriesContext.Provider>
  )
}
