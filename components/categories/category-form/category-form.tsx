import { DEFAULT_CURRENCY } from '@/lib/constants'
import { useUserSession } from '@/lib/hooks'
import { Check, Plus, X } from '@/lib/icons'
import {
  createCategory,
  createOrUpdateBudget,
  updateCategory
} from '@/lib/powersync/data/mutations'
import {
  useGetCategories,
  useGetUserPreferences
} from '@/lib/powersync/data/queries'
import { CategorySelectSQLite } from '@/lib/powersync/schema/table_4_categories'
import { BudgetSelectSQLite } from '@/lib/powersync/schema/table_5_budgets'
import { randomUUID } from 'expo-crypto'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import {
  ExpenseIconName,
  expenseIcons,
  IconName,
  IncomeIconName,
  incomeIcons
} from './category-form-icon'
import { IconSelectionModal } from './modal-icon-selection'

interface SubcategoryData {
  id?: string // For existing subcategories
  name: string
  monthlyBudget: string
}

interface CategoryFormData {
  name: string
  description: string
  selectedIcon: IconName
  monthlyBudget: string
  subcategories: SubcategoryData[]
}

// Type for category with budgets included (from useGetCategories query)
type CategoryWithBudgets = CategorySelectSQLite & {
  budgets?: BudgetSelectSQLite[]
}

interface CategoryFormProps {
  category?: CategoryWithBudgets
  categoryType: 'income' | 'expense'
}

// Utility to calculate default icon based on props
function getDefaultIcon(
  category: CategorySelectSQLite | undefined,
  categoryType: 'income' | 'expense'
): IconName {
  if (category?.icon) return category.icon as IconName

  // Use specific icons that we know exist in each icon set
  if (categoryType === 'income') {
    return 'PiggyBank' as IncomeIconName
  } else {
    return 'Coffee' as ExpenseIconName
  }
}

export function CategoryForm({ category, categoryType }: CategoryFormProps) {
  const { userId } = useUserSession()
  const { data: userPreferences } = useGetUserPreferences({ userId })

  const isEditMode = Boolean(category)

  // Get user's default currency with fallback
  const defaultCurrency =
    userPreferences?.[0]?.defaultCurrency || DEFAULT_CURRENCY.code

  // Fetch existing subcategories when editing a category
  const { data: existingSubcategories } = useGetCategories({
    userId,
    type: categoryType,
    parentId: isEditMode && category ? category.id : undefined
  })

  // Memoized helper to determine the correct default icon
  const getInitialIcon = () => getDefaultIcon(category, categoryType)

  // Local state for icon selection with immediate visual feedback
  const [selectedIcon, setSelectedIcon] = useState<IconName>(() =>
    getInitialIcon()
  )

  // State for icon selection modal
  const [isIconModalVisible, setIsIconModalVisible] = useState(false)

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
      selectedIcon: getInitialIcon(),
      monthlyBudget:
        isEditMode && category && category.budgets?.[0]?.amount
          ? category.budgets[0].amount.toString()
          : '',
      subcategories: []
    }
  })

  // useFieldArray for managing subcategories
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'subcategories'
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
      setValue('monthlyBudget', category.budgets?.[0]?.amount?.toString() || '')

      // Load existing subcategories
      if (existingSubcategories && existingSubcategories.length > 0) {
        const subcategoriesData = existingSubcategories.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          monthlyBudget: sub.budgets?.[0]?.amount?.toString() || ''
        }))
        replace(subcategoriesData)
      } else {
        replace([])
      }
    } else {
      // Reset form for create mode
      reset({
        name: '',
        description: '',
        selectedIcon: initialIcon,
        monthlyBudget: '',
        subcategories: []
      })
    }
  }, [
    category,
    isEditMode,
    categoryType,
    existingSubcategories,
    setValue,
    reset,
    replace
  ])

  const addSubcategory = () => {
    append({ name: '', monthlyBudget: '' })
  }

  const removeSubcategory = (index: number) => {
    remove(index)
  }

  const onSubmit = async (data: CategoryFormData) => {
    if (!data.name.trim()) return

    try {
      let categoryId: string

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
        categoryId = category.id
      } else {
        // Create new category with pre-generated ID
        categoryId = randomUUID()
        const [error] = await createCategory({
          userId,
          data: {
            id: categoryId,
            name: data.name.trim(),
            description: data.description.trim() || '',
            icon: selectedIcon as string,
            type: categoryType,
            parentId: null // Always null since we only create main categories now
          }
        })

        if (error) {
          console.error('Error creating category:', error)
          return
        }
      }

      // Handle budget creation/update if amount is provided
      // Only for expense categories
      if (
        categoryType === 'expense' &&
        data.monthlyBudget &&
        data.monthlyBudget.trim() !== ''
      ) {
        const budgetAmount = parseFloat(data.monthlyBudget.trim())
        if (!isNaN(budgetAmount) && budgetAmount > 0) {
          await createOrUpdateBudget({
            userId,
            categoryId,
            amount: budgetAmount,
            startDate: new Date(),
            currency: defaultCurrency
          })
        }
      }

      // Handle subcategories
      if (data.subcategories.length > 0) {
        // Get current subcategory IDs to track which ones to keep/delete
        const currentSubcategoryIds =
          existingSubcategories?.map((sub: any) => sub.id) || []
        const submittedSubcategoryIds = data.subcategories
          .filter(sub => sub.id)
          .map(sub => sub.id)

        // Delete subcategories that were removed
        for (const currentId of currentSubcategoryIds) {
          if (!submittedSubcategoryIds.includes(currentId)) {
            // TODO: Add delete category mutation when available
            console.log('Would delete subcategory:', currentId)
          }
        }

        // Create or update subcategories
        for (const subcategory of data.subcategories) {
          if (subcategory.name.trim()) {
            if (subcategory.id) {
              // Update existing subcategory
              await updateCategory({
                id: subcategory.id,
                userId,
                data: {
                  name: subcategory.name.trim(),
                  description: '',
                  icon: 'circle'
                }
              })

              // Update budget for existing subcategory
              if (
                categoryType === 'expense' &&
                subcategory.monthlyBudget &&
                subcategory.monthlyBudget.trim() !== ''
              ) {
                const budgetAmount = parseFloat(
                  subcategory.monthlyBudget.trim()
                )
                if (!isNaN(budgetAmount) && budgetAmount > 0) {
                  await createOrUpdateBudget({
                    userId,
                    categoryId: subcategory.id,
                    amount: budgetAmount,
                    startDate: new Date(),
                    currency: defaultCurrency
                  })
                }
              }
            } else {
              // Create new subcategory
              const subcategoryId = randomUUID()
              const [subcategoryError] = await createCategory({
                userId,
                data: {
                  id: subcategoryId,
                  name: subcategory.name.trim(),
                  description: '',
                  icon: 'circle',
                  type: categoryType,
                  parentId: categoryId
                }
              })

              if (subcategoryError) {
                console.error('Error creating subcategory:', subcategoryError)
                continue
              }

              // Create budget for new subcategory if amount is provided and it's an expense category
              if (
                categoryType === 'expense' &&
                subcategory.monthlyBudget &&
                subcategory.monthlyBudget.trim() !== ''
              ) {
                const budgetAmount = parseFloat(
                  subcategory.monthlyBudget.trim()
                )
                if (!isNaN(budgetAmount) && budgetAmount > 0) {
                  await createOrUpdateBudget({
                    userId,
                    categoryId: subcategoryId,
                    amount: budgetAmount,
                    startDate: new Date(),
                    currency: defaultCurrency
                  })
                }
              }
            }
          }
        }
      }

      // Reset form and close modal
      reset()
      setSelectedIcon(
        (categoryType === 'income' ? 'PiggyBank' : 'Coffee') as IconName
      )
      router.back()
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

        {/* Monthly Budget Limit - Only show for expense categories */}
        {categoryType === 'expense' && (
          <View>
            <Text className="mb-3 text-sm font-semibold text-foreground">
              Monthly Spend Limit
            </Text>
            <Controller
              control={control}
              name="monthlyBudget"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    className="rounded-xl border border-border bg-card px-4 py-4 text-base text-foreground"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter monthly limit (optional)"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                  />
                  {value && value.trim() !== '' && (
                    <Text className="mt-1 text-xs text-muted-foreground">
                      You&apos;ll be notified when spending approaches this
                      limit
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        )}

        {/* Subcategories Section */}
        <View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground">
              Subcategories (Optional)
            </Text>
            <Pressable
              onPress={addSubcategory}
              className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
            >
              <Plus size={16} className="text-primary" />
              <Text className="text-sm font-medium text-primary">Add</Text>
            </Pressable>
          </View>

          {fields.length > 0 && (
            <View className="gap-3">
              {fields.map((field, index) => (
                <View
                  key={field.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-foreground">
                      Subcategory {index + 1}
                      {(field as any).id && (
                        <Text className="text-xs text-muted-foreground">
                          {' '}
                          (existing)
                        </Text>
                      )}
                    </Text>
                    <Pressable
                      onPress={() => removeSubcategory(index)}
                      className="rounded-lg bg-red-50 p-2"
                    >
                      <X size={16} className="text-red-500" />
                    </Pressable>
                  </View>

                  <View className="flex-row gap-3">
                    {/* Subcategory Name - Takes more space */}
                    <View className="flex-[2]">
                      <Text className="mb-2 text-xs font-medium text-muted-foreground">
                        Name *
                      </Text>
                      <Controller
                        control={control}
                        name={`subcategories.${index}.name`}
                        rules={{
                          required: 'Subcategory name is required'
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            className="rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Enter subcategory name"
                            placeholderTextColor="#94A3B8"
                          />
                        )}
                      />
                      {errors.subcategories?.[index]?.name && (
                        <Text className="mt-1 text-xs text-red-500">
                          {errors.subcategories[index]?.name?.message}
                        </Text>
                      )}
                    </View>

                    {/* Monthly Budget - Only for expense categories */}
                    {categoryType === 'expense' ? (
                      <View className="flex-1">
                        <Text className="mb-2 text-xs font-medium text-muted-foreground">
                          Monthly Limit
                        </Text>
                        <Controller
                          control={control}
                          name={`subcategories.${index}.monthlyBudget`}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                              className="rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Amount (optional)"
                              placeholderTextColor="#94A3B8"
                              keyboardType="numeric"
                            />
                          )}
                        />
                      </View>
                    ) : (
                      <View className="flex-1" />
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {fields.length === 0 && (
            <View className="rounded-xl border border-dashed border-border bg-muted/30 p-6">
              <Text className="text-center text-sm text-muted-foreground">
                No subcategories added yet. Click &quot;Add&quot; to create
                subcategories for better organization.
              </Text>
            </View>
          )}
        </View>

        {/* Icon Selection */}
        <View>
          <Text className="mb-3 text-sm font-semibold text-foreground">
            Icon
          </Text>
          <Pressable
            onPress={() => setIsIconModalVisible(true)}
            className="rounded-xl border border-border bg-card p-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">
                Choose an icon for your category
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className="h-8 w-8 items-center justify-center rounded-lg border border-border"
                  style={{
                    backgroundColor:
                      categoryType === 'income'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(99, 102, 241, 0.1)'
                  }}
                >
                  {(() => {
                    const iconSet =
                      categoryType === 'income' ? incomeIcons : expenseIcons
                    const IconComponent =
                      iconSet[selectedIcon as keyof typeof iconSet]
                    return IconComponent ? (
                      <IconComponent
                        size={16}
                        color={
                          categoryType === 'income' ? '#10B981' : '#6366F1'
                        }
                      />
                    ) : null
                  })()}
                </View>
                <Text className="text-xs text-muted-foreground">
                  Tap to change
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="flex-row gap-3 border-t border-border/50 px-6 pt-6">
        <Pressable
          className="flex-1 items-center justify-center rounded-xl border border-border py-4"
          onPress={() => router.back()}
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

      {/* Icon Selection Modal */}
      <IconSelectionModal
        isVisible={isIconModalVisible}
        onClose={() => setIsIconModalVisible(false)}
        selectedIcon={selectedIcon}
        onIconSelect={(iconName: IconName) => {
          setSelectedIcon(iconName)
          setValue('selectedIcon', iconName)
        }}
        categoryType={categoryType}
      />
    </>
  )
}
