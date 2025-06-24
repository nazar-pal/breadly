import { useCategoryUI } from '@/components/categories/lib/use-category-ui'
import { TEMP_USER_ID } from '@/lib/constants'
import { useUserSession } from '@/lib/context/user-context'
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
  const { userId } = useUserSession()

  const categoryUI = useCategoryUI()

  return (
    <CategoriesContext.Provider value={{ userId, categoryUI }}>
      {children}
    </CategoriesContext.Provider>
  )
}
