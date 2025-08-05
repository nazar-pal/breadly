import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useUserSession } from '@/lib/hooks'
import { updateCategory } from '@/lib/powersync/data/mutations'
import { createCategory } from '@/lib/powersync/data/mutations/create-category'
import { useGetCategory } from '@/lib/powersync/data/queries'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { CategoryInput } from './category-details-form-input'

interface FormData {
  name: string
  description?: string
}

interface Props {
  onClose: () => void
  parentId: string | null
  categoryId?: string
}

export function CategoryDetailsForm({ onClose, categoryId, parentId }: Props) {
  const isEditMode = Boolean(categoryId)
  const isSubCategory = Boolean(parentId)

  const [submitError, setSubmitError] = useState<string | null>(null)

  const { userId } = useUserSession()

  const categoryData = useGetCategory({ userId, categoryId: categoryId ?? '' })
    .data?.[0]

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { name: '', description: '' }
  })

  useEffect(() => {
    if (isEditMode) {
      if (categoryData) {
        const { name, description } = categoryData
        reset({ name, description: description || '' })
      }
    } else reset({ name: '', description: '' })
  }, [isEditMode, categoryData, reset])

  const onSubmit = async ({ name, description }: FormData) => {
    setSubmitError(null)

    if (isEditMode) {
      const [error] = await updateCategory({
        id: categoryId ?? '',
        userId,
        data: { name, description }
      })
      if (error) {
        setSubmitError('Something went wrong. Please try again.')
        return
      }
    } else {
      const [error] = await createCategory({
        userId,
        data: { name, description, parentId, type: 'expense' }
      })
      if (error) {
        setSubmitError('Something went wrong. Please try again.')
        return
      }
    }

    onClose()
    reset()
  }

  const onCancel = () => {
    onClose()
    reset()
    setSubmitError(null)
  }

  return (
    <View className="z-10 w-[92%] max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
      {/* Category Name */}
      <View>
        <Text className="mb-3 text-center text-lg font-bold text-foreground">
          {isSubCategory ? 'Subcategory Name' : 'Category Name'}
        </Text>

        <CategoryInput
          control={control}
          name="name"
          placeholder={
            isSubCategory ? 'Enter subcategory name' : 'Enter category name'
          }
          rules={{
            required: 'Category name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          }}
        />
      </View>

      {/* Category Name */}
      <View>
        <Text className="mb-3 text-center text-lg font-bold text-foreground">
          {isSubCategory ? 'Subcategory Description' : 'Category Description'}
        </Text>

        <CategoryInput
          control={control}
          name="description"
          placeholder={
            isSubCategory
              ? 'Enter subcategory description'
              : 'Enter category description'
          }
        />
      </View>

      {submitError && (
        <Text className="mb-2 text-center text-sm text-red-500">
          {submitError}
        </Text>
      )}

      <View className="mt-1 flex-row gap-2">
        <Button
          onPress={onCancel}
          variant="outline"
          className="flex-1 rounded-lg py-2"
        >
          <Text className="text-base">Cancel</Text>
        </Button>
        <Button
          onPress={handleSubmit(onSubmit)}
          className="flex-1 flex-row items-center justify-center rounded-lg bg-primary py-2"
        >
          <Icon
            name="Check"
            size={16}
            className="mr-1 text-primary-foreground"
          />
          <Text className="text-base text-primary-foreground">Save</Text>
        </Button>
      </View>
    </View>
  )
}
