import { trpc } from '@/trpc/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Category {
  id: string
  userId: string
  type: 'expense' | 'income'
  parentId?: string | null
  name: string
  description?: string | null
  icon: string
  isArchived: boolean
  createdAt: Date
}

export function useCategories() {
  const queryClient = useQueryClient()

  // Get all categories
  const categoriesQueryOptions = trpc.categories.getAll.queryOptions()
  const {
    data: categories = [],
    isLoading,
    error
  } = useQuery(categoriesQueryOptions)

  // Create category mutation
  const createCategoryMutationOptions = trpc.categories.create.mutationOptions({
    onSuccess: () => {
      const queryKey = trpc.categories.getAll.queryKey()
      queryClient.invalidateQueries({ queryKey })
    }
  })
  const createCategory = useMutation(createCategoryMutationOptions)

  // Update category mutation
  const updateCategoryMutationOptions = trpc.categories.update.mutationOptions({
    onSuccess: () => {
      const queryKey = trpc.categories.getAll.queryKey()
      queryClient.invalidateQueries({ queryKey })
    }
  })
  const updateCategory = useMutation(updateCategoryMutationOptions)

  // Delete category mutation
  const deleteCategoryMutationOptions = trpc.categories.delete.mutationOptions({
    onSuccess: () => {
      const queryKey = trpc.categories.getAll.queryKey()
      queryClient.invalidateQueries({ queryKey })
    }
  })
  const deleteCategory = useMutation(deleteCategoryMutationOptions)

  return {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
