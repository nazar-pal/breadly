import { useUserSession } from '@/lib/hooks'
import {
  AlignLeft,
  Calendar,
  DollarSign,
  Edit2,
  Tag,
  TrendingUp
} from '@/lib/icons'
import {
  useGetCategory,
  useSumTransactions
} from '@/lib/powersync/data/queries'
import {
  useCategoryDetailsActions,
  useCategoryDetailsState
} from '@/lib/storage/category-details-store'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Modal } from '../modal'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import { CategoryCardIcon } from './category-cards-grid/category-card-icon'

export function CategoryDetailsModal() {
  const { isCategoryDetailsModalOpen, categoryDetailsSelectedCategory } =
    useCategoryDetailsState()
  const { closeCategoryDetailsModal } = useCategoryDetailsActions()

  const { userId } = useUserSession()

  const { data: category } = useGetCategory({
    userId: userId,
    categoryId: categoryDetailsSelectedCategory ?? ''
  })

  const { data: totalSpent } = useSumTransactions({
    userId,
    categoryId: categoryDetailsSelectedCategory ?? '',
    type: category?.[0]?.type || 'expense'
  })

  const categoryData = category?.[0]
  const totalAmount = Number(totalSpent?.[0]?.totalAmount || 0)

  // Budget calculations
  const monthlyBudget = categoryData?.budgets?.find(
    budget => budget.period === 'monthly'
  )
  const budgetAmount = monthlyBudget?.amount || 0
  const budgetProgress =
    budgetAmount > 0 ? Math.min((totalAmount / budgetAmount) * 100, 100) : 0
  const isOverBudget = totalAmount > budgetAmount && budgetAmount > 0
  const remainingBudget = Math.max(budgetAmount - totalAmount, 0)

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleEdit = () => {
    closeCategoryDetailsModal()
    if (categoryData) {
      router.push(`/categories/edit/${categoryData.id}`)
    }
  }

  if (!categoryData) {
    return null
  }

  return (
    <Modal
      isVisible={isCategoryDetailsModalOpen}
      onClose={closeCategoryDetailsModal}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-6">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-foreground">
              Category Details
            </Text>
            <Pressable
              onPress={handleEdit}
              className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
            >
              <Edit2 size={16} className="text-primary" />
              <Text className="text-sm font-medium text-primary">Edit</Text>
            </Pressable>
          </View>

          {/* Category Header Card */}
          <Card className="mb-6 p-4">
            <View className="flex-row items-center">
              <CategoryCardIcon
                name={categoryData.icon}
                type={categoryData.type}
              />
              <View className="ml-4 flex-1">
                <View className="mb-2 flex-row items-center gap-2">
                  <Text className="text-lg font-bold text-foreground">
                    {categoryData.name}
                  </Text>
                  <Badge
                    variant={
                      categoryData.type === 'income' ? 'default' : 'secondary'
                    }
                    className={`${
                      categoryData.type === 'income'
                        ? 'bg-income/20 text-income'
                        : 'bg-expense/20 text-expense'
                    }`}
                  >
                    <Text className="text-xs font-medium capitalize">
                      {categoryData.type}
                    </Text>
                  </Badge>
                </View>
                <View className="flex-row items-center gap-1">
                  <DollarSign
                    size={16}
                    className={
                      categoryData.type === 'income'
                        ? 'text-income'
                        : 'text-expense'
                    }
                  />
                  <Text
                    className={`text-lg font-bold ${
                      categoryData.type === 'income'
                        ? 'text-income'
                        : 'text-expense'
                    }`}
                  >
                    ${totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Budget Progress Card */}
          {categoryData?.type === 'expense' && monthlyBudget && (
            <Card className="mb-6 p-4">
              <View className="mb-4 flex-row items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                <Text className="text-base font-semibold text-foreground">
                  Monthly Budget Progress
                </Text>
              </View>

              <View className="mb-4">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-foreground">
                    Spent: ${totalAmount.toFixed(2)}
                  </Text>
                  <Text className="text-sm font-medium text-foreground">
                    Budget: ${budgetAmount.toFixed(2)}
                  </Text>
                </View>

                <Progress
                  value={budgetProgress}
                  className="h-3"
                  indicatorClassName={
                    isOverBudget ? 'bg-red-500' : 'bg-green-500'
                  }
                />

                <View className="mt-2 flex-row items-center justify-between">
                  <Text
                    className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}
                  >
                    {budgetProgress.toFixed(1)}% used
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {isOverBudget
                      ? `$${(totalAmount - budgetAmount).toFixed(2)} over budget`
                      : `$${remainingBudget.toFixed(2)} remaining`}
                  </Text>
                </View>
              </View>

              {isOverBudget && (
                <View className="rounded-lg bg-red-50 p-3">
                  <Text className="text-sm font-medium text-red-800">
                    ⚠️ Budget Exceeded
                  </Text>
                  <Text className="text-xs text-red-600">
                    You&apos;ve spent ${(totalAmount - budgetAmount).toFixed(2)}{' '}
                    more than your monthly limit.
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Details Section */}
          <Card className="p-4">
            <Text className="mb-4 text-base font-semibold text-foreground">
              Information
            </Text>

            {/* Description */}
            {categoryData.description && (
              <>
                <View className="mb-4 flex-row items-start gap-3">
                  <AlignLeft
                    size={18}
                    className="mt-0.5 text-muted-foreground"
                  />
                  <View className="flex-1">
                    <Text className="mb-1 text-sm font-medium text-foreground">
                      Description
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {categoryData.description}
                    </Text>
                  </View>
                </View>
                <Separator className="mb-4" />
              </>
            )}

            {/* Category Type */}
            <View className="mb-4 flex-row items-center gap-3">
              <Tag size={18} className="text-muted-foreground" />
              <View className="flex-1">
                <Text className="mb-1 text-sm font-medium text-foreground">
                  Category Type
                </Text>
                <Text className="text-sm capitalize text-muted-foreground">
                  {categoryData.type} Category
                </Text>
              </View>
            </View>

            <Separator className="mb-4" />

            {/* Total Amount */}
            <View className="mb-4 flex-row items-center gap-3">
              <DollarSign size={18} className="text-muted-foreground" />
              <View className="flex-1">
                <Text className="mb-1 text-sm font-medium text-foreground">
                  Total {categoryData.type === 'income' ? 'Earned' : 'Spent'}
                </Text>
                <Text
                  className={`text-sm ${
                    categoryData.type === 'income'
                      ? 'text-income'
                      : 'text-expense'
                  }`}
                >
                  ${totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>

            <Separator className="mb-4" />

            {/* Creation Date */}
            <View className="flex-row items-center gap-3">
              <Calendar size={18} className="text-muted-foreground" />
              <View className="flex-1">
                <Text className="mb-1 text-sm font-medium text-foreground">
                  Created On
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {formatDate(categoryData.createdAt)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Statistics Card */}
          <Card className="mt-4 p-4">
            <Text className="mb-4 text-base font-semibold text-foreground">
              Quick Stats
            </Text>

            <View className="flex-row justify-between">
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-primary">
                  {totalAmount > 0 ? '1' : '0'}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Active Category
                </Text>
              </View>

              <View className="w-px bg-border" />

              <View className="flex-1 items-center">
                <Text
                  className={`text-2xl font-bold ${
                    categoryData.type === 'income'
                      ? 'text-income'
                      : 'text-expense'
                  }`}
                >
                  ${totalAmount.toFixed(0)}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Total Amount
                </Text>
              </View>

              <View className="w-px bg-border" />

              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {categoryData.isArchived ? 'No' : 'Yes'}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Active Status
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Modal>
  )
}
