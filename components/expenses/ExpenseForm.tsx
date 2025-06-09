import { useTheme } from '@/context/ThemeContext'
import { mockCategories } from '@/data/mockData'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlignLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  X
} from 'lucide-react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native'
import * as z from 'zod'
import Button from '../ui/Button'

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

export default function ExpenseForm({
  onSubmit,
  initialData
}: ExpenseFormProps) {
  const { colors, spacing } = useTheme()
  const [showDescription, setShowDescription] = useState(false)
  const [expenses, setExpenses] = useState<ExpenseFormData[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [editingExpenseIndex, setEditingExpenseIndex] = useState<number | null>(
    null
  )

  const today = new Date().toISOString().split('T')[0]

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
      // Update existing expense
      const updatedExpenses = [...expenses]
      updatedExpenses[editingExpenseIndex] = data
      setExpenses(updatedExpenses)
      setEditingExpenseIndex(null)
    } else {
      // Add new expense
      setExpenses([...expenses, data])
    }

    reset({
      amount: '',
      description: '',
      category: data.category, // Keep the same category for convenience
      date: data.date // Keep the same date for convenience
    })
    setShowDescription(false)
  }

  const handleFinalSubmit = () => {
    handleSubmit(data => {
      const allExpenses = [...expenses, data]
      onSubmit(allExpenses[0]) // For now, just submit the first expense
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
            <Text
              className="mb-2 text-sm font-medium"
              style={{ color: colors.text }}
            >
              Amount
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    className="h-12 rounded-lg border px-4 text-xl font-semibold"
                    style={{
                      color: colors.text,
                      borderColor: errors.amount ? colors.error : colors.border,
                      backgroundColor: colors.card
                    }}
                    placeholderTextColor={colors.textSecondary}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.amount && (
                    <Text
                      className="mt-1 text-xs"
                      style={{ color: colors.error }}
                    >
                      {errors.amount.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <View className="flex-[1.2]">
            <Text
              className="mb-2 text-sm font-medium"
              style={{ color: colors.text }}
            >
              Category
            </Text>
            <Pressable
              onPress={() => setShowCategoryPicker(true)}
              className="h-12 flex-row items-center justify-between rounded-lg border px-4"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              <Text
                className="flex-1 text-base"
                style={{
                  color: selectedCategory ? colors.text : colors.textSecondary
                }}
                numberOfLines={1}
              >
                {selectedCategory || 'Select'}
              </Text>
              <ChevronDown size={20} color={colors.text} />
            </Pressable>
            {errors.category && (
              <Text className="mt-1 text-xs" style={{ color: colors.error }}>
                {errors.category.message}
              </Text>
            )}
          </View>
        </View>

        <View className="mb-4 flex-row items-end">
          <View className="flex-1">
            <Text
              className="mb-2 text-sm font-medium"
              style={{ color: colors.text }}
            >
              Date
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="h-12 flex-row items-center justify-between rounded-lg border px-4"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              <Text className="text-base" style={{ color: colors.text }}>
                {selectedDate === today ? 'Today' : formatDate(selectedDate)}
              </Text>
              <Calendar size={20} color={colors.text} />
            </Pressable>
          </View>

          <Pressable
            onPress={() => setShowDescription(!showDescription)}
            className="ml-3 h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: colors.iconBackground.neutral }}
          >
            <AlignLeft size={20} color={colors.text} />
          </Pressable>
        </View>

        {showDescription && (
          <View className="mb-4">
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-20 rounded-lg border px-4 py-3 text-base"
                  style={{
                    color: colors.text,
                    borderColor: errors.description
                      ? colors.error
                      : colors.border,
                    backgroundColor: colors.card,
                    textAlignVertical: 'top'
                  }}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="What was this expense for?"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                />
              )}
            />
          </View>
        )}

        <View className="mt-6 flex-row">
          {editingExpenseIndex !== null ? (
            <>
              <Button
                variant="outline"
                onPress={handleCancelEdit}
                style={{ flex: 1, marginRight: spacing.sm }}
                leftIcon={<X size={20} color={colors.text} />}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit(handleAddExpense)}
                style={{ flex: 1 }}
              >
                Update Expense
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onPress={handleSubmit(handleAddExpense)}
                style={{ flex: 1, marginRight: spacing.sm }}
                leftIcon={<Plus size={20} color={colors.text} />}
              >
                Add Another
              </Button>
              <Button
                variant="primary"
                onPress={handleFinalSubmit}
                style={{ flex: 1 }}
              >
                Save {expenses.length > 0 ? 'All ' : ''}
                Expense{expenses.length !== 0 ? 's' : ''}
              </Button>
            </>
          )}
        </View>
      </View>

      {/* Added Expenses List */}
      {expenses.length > 0 && (
        <View
          className="rounded-lg p-4"
          style={{ backgroundColor: colors.surfaceSecondary }}
        >
          <Text
            className="mb-3 text-sm font-semibold"
            style={{ color: colors.text }}
          >
            Added Expenses ({expenses.length})
          </Text>
          {expenses.map((expense, index) => (
            <Pressable
              key={index}
              onPress={() => handleEditExpense(index)}
              className="mb-2 rounded-lg p-3"
              style={{
                backgroundColor:
                  editingExpenseIndex === index ? colors.card : 'transparent'
              }}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.text }}
                >
                  ${parseFloat(expense.amount).toFixed(2)}
                </Text>
                <View className="mx-3 flex-1 flex-row items-center justify-end gap-2">
                  <Text
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {formatDate(expense.date)}
                  </Text>
                  <View
                    className="rounded px-2 py-1"
                    style={{ backgroundColor: colors.card }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: colors.text }}
                    >
                      {expense.category}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
              {expense.description && (
                <Text
                  className="mt-2 pl-1 text-[13px]"
                  style={{ color: colors.textSecondary }}
                  numberOfLines={2}
                >
                  {expense.description}
                </Text>
              )}
            </Pressable>
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
          className="flex-1 justify-center p-4"
          style={{ backgroundColor: colors.shadow }}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View
            className="max-h-[80%] rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="border-b p-4 text-lg font-semibold"
              style={{
                color: colors.text,
                borderBottomColor: colors.borderLight
              }}
            >
              Select Category
            </Text>
            <ScrollView>
              {mockCategories.map(category => (
                <Pressable
                  key={category.id}
                  className="p-4"
                  style={{
                    backgroundColor:
                      selectedCategory === category.name
                        ? colors.primary
                        : 'transparent'
                  }}
                  onPress={() => {
                    setValue('category', category.name)
                    setShowCategoryPicker(false)
                  }}
                >
                  <Text
                    className="text-base"
                    style={{
                      color:
                        selectedCategory === category.name
                          ? colors.textInverse
                          : colors.text
                    }}
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
          className="flex-1 justify-center p-4"
          style={{ backgroundColor: colors.shadow }}
          onPress={() => setShowDatePicker(false)}
        >
          <View
            className="max-h-[80%] rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="border-b p-4 text-lg font-semibold"
              style={{
                color: colors.text,
                borderBottomColor: colors.borderLight
              }}
            >
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
                    className="p-4"
                    style={{
                      backgroundColor:
                        selectedDate === dateString
                          ? colors.primary
                          : 'transparent'
                    }}
                    onPress={() => {
                      setValue('date', dateString)
                      setShowDatePicker(false)
                    }}
                  >
                    <Text
                      className="text-base"
                      style={{
                        color:
                          selectedDate === dateString
                            ? colors.textInverse
                            : colors.text
                      }}
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
