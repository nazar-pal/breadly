import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useUserSession } from '@/lib/context/user-context'
import {
  AlignLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  X
} from '@/lib/icons'
import { useGetCategories } from '@/lib/powersync/data/queries'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native'
import * as z from 'zod/v4'

const expenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required')
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void
  initialData?: Partial<ExpenseFormData>
}

function FormField({
  label,
  error,
  children
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
      {children}
      {error && <Text className="mt-1 text-xs text-destructive">{error}</Text>}
    </View>
  )
}

function ExpenseListItem({
  expense,
  isEditing,
  onPress
}: {
  expense: ExpenseFormData
  isEditing: boolean
  onPress: () => void
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mb-2 rounded-lg p-3',
        isEditing ? 'bg-card' : 'bg-transparent'
      )}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-expense">
          ${parseFloat(expense.amount).toFixed(2)}
        </Text>
        <View className="mx-3 flex-1 flex-row items-center justify-end gap-2">
          <Text className="text-xs text-muted-foreground">
            {formatDate(expense.date)}
          </Text>
          <View className="rounded bg-muted px-2 py-1">
            <Text className="text-xs font-medium text-foreground">
              {expense.category}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} className="text-muted-foreground" />
      </View>
      {expense.description && (
        <Text
          className="mt-2 pl-1 text-[13px] text-muted-foreground"
          numberOfLines={2}
        >
          {expense.description}
        </Text>
      )}
    </Pressable>
  )
}

export function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [expenses, setExpenses] = useState<ExpenseFormData[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [editingExpenseIndex, setEditingExpenseIndex] = useState<number | null>(
    null
  )

  const today = new Date().toISOString().split('T')[0]

  const { userId } = useUserSession()

  const { data: categories } = useGetCategories({
    userId: userId,
    type: 'expense'
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: initialData?.amount || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      date: initialData?.date || today
    }
  })

  const selectedCategory = watch('category')
  const selectedDate = watch('date')

  const handleAddExpense = (data: ExpenseFormData) => {
    if (editingExpenseIndex !== null) {
      const updatedExpenses = [...expenses]
      updatedExpenses[editingExpenseIndex] = data
      setExpenses(updatedExpenses)
      setEditingExpenseIndex(null)
    } else {
      setExpenses([...expenses, data])
    }

    reset({
      amount: '',
      description: '',
      category: data.category,
      date: data.date
    })
    setShowDescription(false)
  }

  const handleFinalSubmit = () => {
    handleSubmit(data => {
      const allExpenses = [...expenses, data]
      onSubmit(allExpenses[0])
    })()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleEditExpense = (index: number) => {
    const expense = expenses[index]
    setEditingExpenseIndex(index)
    reset(expense)
    setShowDescription(!!expense.description)
  }

  const handleCancelEdit = () => {
    setEditingExpenseIndex(null)
    reset({
      amount: '',
      description: '',
      category: '',
      date: today
    })
    setShowDescription(false)
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Form Section */}
      <View className="mb-6">
        <View className="mb-4 flex-row items-start">
          <View className="mr-3 flex-1">
            <FormField label="Amount" error={errors.amount?.message}>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={cn(
                      'h-12 rounded-lg border bg-card px-4 text-xl font-semibold text-foreground',
                      errors.amount ? 'border-destructive' : 'border-border'
                    )}
                    placeholder="0.00"
                    placeholderTextColor="hsl(var(--muted-foreground))"
                    keyboardType="decimal-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </FormField>
          </View>

          <View className="flex-[1.2]">
            <FormField label="Category" error={errors.category?.message}>
              <Pressable
                onPress={() => setShowCategoryPicker(true)}
                className="h-12 flex-row items-center justify-between rounded-lg border border-border bg-card px-4"
              >
                <Text
                  className={cn(
                    'flex-1 text-base',
                    selectedCategory
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                  numberOfLines={1}
                >
                  {selectedCategory || 'Select'}
                </Text>
                <ChevronDown size={20} className="text-foreground" />
              </Pressable>
            </FormField>
          </View>
        </View>

        <View className="mb-4 flex-row items-end">
          <View className="flex-1">
            <FormField label="Date">
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="h-12 flex-row items-center justify-between rounded-lg border border-border bg-card px-4"
              >
                <Text className="text-base text-foreground">
                  {selectedDate === today ? 'Today' : formatDate(selectedDate)}
                </Text>
                <Calendar size={20} className="text-foreground" />
              </Pressable>
            </FormField>
          </View>

          <Pressable
            onPress={() => setShowDescription(!showDescription)}
            className="ml-3 h-12 w-12 items-center justify-center rounded-lg bg-muted"
          >
            <AlignLeft size={20} className="text-foreground" />
          </Pressable>
        </View>

        {showDescription && (
          <FormField label="Description">
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={cn(
                    'h-20 rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground',
                    errors.description && 'border-destructive'
                  )}
                  placeholder="What was this expense for?"
                  placeholderTextColor="hsl(var(--muted-foreground))"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              )}
            />
          </FormField>
        )}

        <View className="mt-6 flex-row">
          {editingExpenseIndex !== null ? (
            <>
              <Button
                variant="outline"
                onPress={handleCancelEdit}
                className="mr-2 flex-1"
              >
                <X size={20} className="mr-2 text-foreground" />
                <Text className="text-foreground">Cancel</Text>
              </Button>
              <Button
                variant="default"
                onPress={handleSubmit(handleAddExpense)}
                className="flex-1"
              >
                <Text className="text-primary-foreground">Update Expense</Text>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onPress={handleSubmit(handleAddExpense)}
                className="mr-2 flex-1"
              >
                <Plus size={20} className="mr-2 text-foreground" />
                <Text className="text-foreground">Add Another</Text>
              </Button>
              <Button
                variant="default"
                onPress={handleFinalSubmit}
                className="flex-1"
              >
                <Text className="text-primary-foreground">
                  Save {expenses.length > 0 ? 'All ' : ''}Expense
                  {expenses.length !== 0 ? 's' : ''}
                </Text>
              </Button>
            </>
          )}
        </View>
      </View>

      {/* Added Expenses List */}
      {expenses.length > 0 && (
        <View className="rounded-lg bg-muted p-4">
          <Text className="mb-3 text-sm font-semibold text-foreground">
            Added Expenses ({expenses.length})
          </Text>
          {expenses.map((expense, index) => (
            <ExpenseListItem
              key={index}
              expense={expense}
              isEditing={editingExpenseIndex === index}
              onPress={() => handleEditExpense(index)}
            />
          ))}
        </View>
      )}

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <Pressable
          className="flex-1 justify-center bg-black/10 p-4"
          onPress={() => setShowCategoryPicker(false)}
        >
          <View className="max-h-[80%] rounded-xl bg-card">
            <Text className="border-b border-border p-4 text-lg font-semibold text-foreground">
              Select Category
            </Text>
            <ScrollView>
              {categories.map(category => (
                <Pressable
                  key={category.id}
                  className={cn(
                    'p-4',
                    selectedCategory === category.name && 'bg-primary'
                  )}
                  onPress={() => {
                    setValue('category', category.name)
                    setShowCategoryPicker(false)
                  }}
                >
                  <Text
                    className={cn(
                      'text-base',
                      selectedCategory === category.name
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    )}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable
          className="flex-1 justify-center bg-black/10 p-4"
          onPress={() => setShowDatePicker(false)}
        >
          <View className="max-h-[80%] rounded-xl bg-card">
            <Text className="border-b border-border p-4 text-lg font-semibold text-foreground">
              Select Date
            </Text>
            <ScrollView>
              {[...Array(7)].map((_, index) => {
                const date = new Date()
                date.setDate(date.getDate() - index)
                const dateString = date.toISOString().split('T')[0]
                const isToday = index === 0

                return (
                  <Pressable
                    key={dateString}
                    className={cn(
                      'p-4',
                      selectedDate === dateString && 'bg-primary'
                    )}
                    onPress={() => {
                      setValue('date', dateString)
                      setShowDatePicker(false)
                    }}
                  >
                    <Text
                      className={cn(
                        'text-base',
                        selectedDate === dateString
                          ? 'text-primary-foreground'
                          : 'text-foreground'
                      )}
                    >
                      {isToday ? 'Today' : formatDate(dateString)}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  )
}
