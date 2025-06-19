import { useCategoryUI } from '@/components/categories/lib/use-category-ui'
import { TEMP_USER_ID } from '@/lib/constants'
import { useAuth } from '@clerk/clerk-expo'
import React, { createContext } from 'react'

export const CategoriesContext = createContext<{
  userId: string
  categoryUI: ReturnType<typeof useCategoryUI>
}>({
  userId: TEMP_USER_ID,
  categoryUI: {} as ReturnType<typeof useCategoryUI>
})

export function CategoriesContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { userId, isLoaded } = useAuth()

  const categoryUI = useCategoryUI()

  if (!isLoaded) {
    return null
  }

  return (
    <CategoriesContext.Provider
      value={{ userId: userId || TEMP_USER_ID, categoryUI }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}
