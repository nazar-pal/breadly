import { useUserSession } from '@/lib/hooks'
import { Check } from '@/lib/icons'
import { createCategory, updateCategory } from '@/lib/powersync/data/mutations'
import React, { use, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { CategoriesContext } from './categories-context'
import { CategoryFormIcon, IconName } from './category-form-icon'
import { useCategoryType } from './lib/use-category-type'

interface CategoryFormData {
  name: string
  description: string
  selectedIcon: IconName
}

export function CategoryForm() {
  const { userId } = useUserSession()
  const { categoryUI } = use(CategoriesContext)

  const { categoryToEdit: category, handleCloseCategoryModal: onClose } =
    categoryUI

  const categoryType = useCategoryType()
  const isEditMode = Boolean(category)

  // Get initial values based on edit mode
  const getInitialIcon = (): IconName => {
    if (isEditMode && category?.icon) {
      return category.icon as IconName
    }
    return (categoryType === 'income' ? 'PiggyBank' : 'Coffee') as IconName
  }

  // Local state for icon selection with immediate visual feedback
  const [selectedIcon, setSelectedIcon] = useState<IconName>(getInitialIcon())

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: isEditMode && category ? category.name : '',
      description: isEditMode && category ? category.description || '' : '',
      selectedIcon: getInitialIcon()
    }
  })

  // Update form when category changes (when switching between create/edit)
  useEffect(() => {
    const initialIcon = getInitialIcon()
    setSelectedIcon(initialIcon)

    if (isEditMode && category) {
      // Pre-populate form with existing category data
      setValue('name', category.name)
      setValue('description', category.description || '')
      setValue('selectedIcon', initialIcon)
    } else {
      // Reset form for create mode
      reset({
        name: '',
        description: '',
        selectedIcon: initialIcon
      })
    }
  }, [category, isEditMode, categoryType, setValue, reset])

  const onSubmit = async (data: CategoryFormData) => {
    if (!data.name.trim()) return

    try {
      if (isEditMode && category) {
        // Update existing category
        await updateCategory({
          id: category.id,
          userId,
          data: {
            name: data.name.trim(),
            description: data.description.trim(),
            icon: selectedIcon as string
          }
        })
      } else {
        // Create new category
        await createCategory({
          userId,
          data: {
            name: data.name.trim(),
            description: data.description.trim() || '',
            icon: selectedIcon as string,
            type: categoryType
          }
        })
      }

      // Reset form and close modal
      reset()
      setSelectedIcon(
        (categoryType === 'income' ? 'PiggyBank' : 'Coffee') as IconName
      )
      onClose()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  return (
    <>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 24,
          gap: 24,
          flexGrow: 1 // Ensure content takes available space
        }}
      >
        {/* Category Name */}
        <View>
          <Text className="mb-3 text-sm font-semibold text-foreground">
            Category Name *
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Category name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  className="rounded-xl border border-border bg-card px-4 py-4 text-base text-foreground"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter category name"
                  placeholderTextColor="#94A3B8"
                />
                {errors.name && (
                  <Text className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Category Description */}
        <View>
          <Text className="mb-3 text-sm font-semibold text-foreground">
            Description
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="h-24 rounded-xl border border-border bg-card px-4 py-4 text-base text-foreground"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Add a description (optional)"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>

        {/* Icon Selection */}
        <CategoryFormIcon
          selectedIcon={selectedIcon}
          onIconSelect={iconName => {
            setSelectedIcon(iconName)
            setValue('selectedIcon', iconName)
          }}
        />
      </ScrollView>

      {/* Footer */}
      <View className="flex-row gap-3 border-t border-border/50 px-6 pt-6">
        <Pressable
          className="flex-1 items-center justify-center rounded-xl border border-border py-4"
          onPress={onClose}
        >
          <Text className="text-base font-semibold text-foreground">
            Cancel
          </Text>
        </Pressable>

        <Pressable
          className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-4"
          style={{
            backgroundColor: categoryType === 'income' ? '#10B981' : '#6366F1'
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Check size={18} color="#FFFFFF" />
          <Text className="text-base font-semibold text-white">
            {isEditMode ? 'Save Changes' : 'Create Category'}
          </Text>
        </Pressable>
      </View>
    </>
  )
}
