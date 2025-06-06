import { useCategoryManagement } from '@/hooks/useCategoryManagement'
import React, { createContext, useContext } from 'react'

// Create the context type based on the hook return type
type CategoryContextType = ReturnType<typeof useCategoryManagement>

// Create the context
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
)

// Provider component
interface CategoryProviderProps {
  children: React.ReactNode
}

export function CategoryProvider({ children }: CategoryProviderProps) {
  const categoryManagement = useCategoryManagement()

  return (
    <CategoryContext.Provider value={categoryManagement}>
      {children}
    </CategoryContext.Provider>
  )
}

// Custom hook to use the context
export function useCategoryContext() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryProvider')
  }
  return context
}
