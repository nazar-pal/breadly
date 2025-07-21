import { useUserSession } from '@/lib/hooks'
import {
  AlignLeft,
  Archive,
  Calendar,
  DollarSign,
  Edit2,
  RefreshCw,
  Tag,
  Trash2,
  TrendingUp
} from '@/lib/icons'
import {
  deleteCategory,
  setCategoryArchiveStatus
} from '@/lib/powersync/data/mutations'
import {
  useCheckCategoryDependencies,
  useGetCategories,
  useGetCategory,
  useSumTransactions
} from '@/lib/powersync/data/queries'
import {
  useCategoryDetailsActions,
  useCategoryDetailsState
} from '@/lib/storage/category-details-store'
import { endOfMonth, startOfMonth } from 'date-fns'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { Modal } from '../modal'
import { CategoryBudgetModal } from '../statistics/modal-category-budget'
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
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingArchiveStatus, setIsUpdatingArchiveStatus] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  const { data: category } = useGetCategory({
    userId: userId,
    categoryId: categoryDetailsSelectedCategory ?? ''
  })

  const { data: totalSpent } = useSumTransactions({
    userId,
    categoryId: categoryDetailsSelectedCategory ?? '',
    type: category?.[0]?.type || 'expense'
  })

  const {
    canDelete,
    hasTransactions,
    hasBudgets,
    hasSubcategories,
    transactionCount,
    budgetCount,
    subcategoryCount,
    isLoading: isDependencyCheckLoading
  } = useCheckCategoryDependencies({
    userId,
    categoryId: categoryDetailsSelectedCategory ?? ''
  })

  // Get subcategories for this category using the unified hook
  const { data: subcategories } = useGetCategories({
    userId,
    type: category?.[0]?.type || 'expense',
    parentId: categoryDetailsSelectedCategory ?? ''
  })

  const categoryData = category?.[0]
  const totalAmount = Number(totalSpent?.[0]?.totalAmount || 0)

  // Budget calculations
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)

  const monthlyBudget = categoryData?.budgets?.find(budget => {
    const budgetStart = new Date(budget.startDate)
    const budgetEnd = new Date(budget.endDate)
    return budgetStart <= currentMonthEnd && budgetEnd >= currentMonthStart
  })
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

  const handleDelete = () => {
    if (!categoryData) return

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${categoryData.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true)
            try {
              const [error] = await deleteCategory({
                id: categoryData.id,
                userId
              })

              if (error) {
                Alert.alert(
                  'Error',
                  'Failed to delete category. Please try again.'
                )
              } else {
                closeCategoryDetailsModal()
              }
            } catch (err) {
              Alert.alert(
                'Error',
                'Failed to delete category. Please try again.'
              )
            } finally {
              setIsDeleting(false)
            }
          }
        }
      ]
    )
  }

  const handleArchive = () => {
    if (!categoryData) return

    const dependencyMessage = []
    if (hasTransactions)
      dependencyMessage.push(
        `${transactionCount} transaction${transactionCount !== 1 ? 's' : ''}`
      )
    if (hasBudgets)
      dependencyMessage.push(
        `${budgetCount} budget${budgetCount !== 1 ? 's' : ''}`
      )
    if (hasSubcategories)
      dependencyMessage.push(
        `${subcategoryCount} subcategor${subcategoryCount !== 1 ? 'ies' : 'y'}`
      )

    const message =
      dependencyMessage.length > 0
        ? `"${categoryData.name}" has ${dependencyMessage.join(', ')} and will be archived instead of deleted. Archived categories are hidden but preserve your data.`
        : `Are you sure you want to archive "${categoryData.name}"? It will be hidden but can be restored later.`

    Alert.alert('Archive Category', message, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Archive',
        style: 'default',
        onPress: async () => {
          setIsUpdatingArchiveStatus(true)
          try {
            const [error] = await setCategoryArchiveStatus({
              id: categoryData.id,
              userId,
              isArchived: true
            })

            if (error) {
              Alert.alert(
                'Error',
                'Failed to archive category. Please try again.'
              )
            } else {
              closeCategoryDetailsModal()
            }
          } catch (err) {
            Alert.alert(
              'Error',
              'Failed to archive category. Please try again.'
            )
          } finally {
            setIsUpdatingArchiveStatus(false)
          }
        }
      }
    ])
  }

  const handleUnarchive = () => {
    if (!categoryData) return

    Alert.alert(
      'Unarchive Category',
      `Are you sure you want to restore "${categoryData.name}"? It will become visible and usable again.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Unarchive',
          style: 'default',
          onPress: async () => {
            setIsUpdatingArchiveStatus(true)
            try {
              const [error] = await setCategoryArchiveStatus({
                id: categoryData.id,
                userId,
                isArchived: false
              })

              if (error) {
                Alert.alert(
                  'Error',
                  'Failed to unarchive category. Please try again.'
                )
              } else {
                closeCategoryDetailsModal()
              }
            } catch (err) {
              Alert.alert(
                'Error',
                'Failed to unarchive category. Please try again.'
              )
            } finally {
              setIsUpdatingArchiveStatus(false)
            }
          }
        }
      ]
    )
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
            <View className="flex-row gap-2">
              <Pressable
                onPress={handleEdit}
                className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
              >
                <Edit2 size={16} className="text-primary" />
                <Text className="text-sm font-medium text-primary">Edit</Text>
              </Pressable>

              {!isDependencyCheckLoading && (
                <>
                  {categoryData.isArchived ? (
                    <Pressable
                      onPress={handleUnarchive}
                      disabled={isUpdatingArchiveStatus}
                      className="flex-row items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2"
                    >
                      <RefreshCw size={16} className="text-green-600" />
                      <Text className="text-sm font-medium text-green-600">
                        {isUpdatingArchiveStatus
                          ? 'Unarchiving...'
                          : 'Unarchive'}
                      </Text>
                    </Pressable>
                  ) : (
                    <>
                      {canDelete ? (
                        <Pressable
                          onPress={handleDelete}
                          disabled={isDeleting}
                          className="flex-row items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2"
                        >
                          <Trash2 size={16} className="text-red-600" />
                          <Text className="text-sm font-medium text-red-600">
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={handleArchive}
                          disabled={isUpdatingArchiveStatus}
                          className="flex-row items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2"
                        >
                          <Archive size={16} className="text-orange-600" />
                          <Text className="text-sm font-medium text-orange-600">
                            {isUpdatingArchiveStatus
                              ? 'Archiving...'
                              : 'Archive'}
                          </Text>
                        </Pressable>
                      )}
                    </>
                  )}
                </>
              )}
            </View>
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
                  {categoryData.isArchived && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-200 text-gray-700"
                    >
                      <Text className="text-xs font-medium">Archived</Text>
                    </Badge>
                  )}
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

          {/* Subcategories Section */}
          {subcategories && subcategories.length > 0 && (
            <Card className="mb-6 p-4">
              <View className="mb-4 flex-row items-center gap-2">
                <Tag size={18} className="text-primary" />
                <Text className="text-base font-semibold text-foreground">
                  Subcategories ({subcategories.length})
                </Text>
              </View>

              <View className="gap-3">
                {subcategories.map((subcategory: any, index: number) => {
                  const subcategoryAmount = subcategory.transactions.reduce(
                    (acc: number, tx: any) => acc + tx.amount,
                    0
                  )

                  return (
                    <View key={subcategory.id}>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-sm font-medium text-foreground">
                            {subcategory.name}
                          </Text>
                          {subcategory.description && (
                            <Text className="mt-1 text-xs text-muted-foreground">
                              {subcategory.description}
                            </Text>
                          )}
                        </View>
                        <Text
                          className={`text-sm font-semibold ${
                            categoryData.type === 'income'
                              ? 'text-income'
                              : 'text-expense'
                          }`}
                        >
                          ${subcategoryAmount.toFixed(2)}
                        </Text>
                      </View>
                      {index < subcategories.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </View>
                  )
                })}
              </View>
            </Card>
          )}

          {/* Monthly Budget Card */}
          {categoryData?.type === 'expense' && (
            <Card className="mb-6 p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <DollarSign size={18} className="text-primary" />
                  <Text className="text-base font-semibold text-foreground">
                    Monthly Budget
                  </Text>
                </View>
                <Pressable
                  onPress={() => setShowBudgetModal(true)}
                  className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
                >
                  <Edit2 size={14} className="text-primary" />
                  <Text className="text-sm font-medium text-primary">
                    {budgetAmount > 0 ? 'Edit' : 'Set Budget'}
                  </Text>
                </Pressable>
              </View>

              {budgetAmount > 0 ? (
                <View>
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-foreground">
                      Budget Limit
                    </Text>
                    <Text className="text-lg font-bold text-foreground">
                      ${budgetAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-foreground">
                      Spent This Month
                    </Text>
                    <Text
                      className={`text-lg font-bold ${
                        isOverBudget ? 'text-red-500' : 'text-expense'
                      }`}
                    >
                      ${totalAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View className="mt-3 flex-row items-center justify-between">
                    <Text className="text-xs text-muted-foreground">
                      {isOverBudget
                        ? `$${(totalAmount - budgetAmount).toFixed(2)} over budget`
                        : `$${remainingBudget.toFixed(2)} remaining`}
                    </Text>
                    <Text
                      className={`text-xs ${
                        isOverBudget ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {budgetProgress.toFixed(1)}% used
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="rounded-lg bg-muted/30 p-4">
                  <Text className="text-center text-sm text-muted-foreground">
                    No monthly budget set. Tap &quot;Set Budget&quot; to add a
                    spending limit for this category.
                  </Text>
                </View>
              )}
            </Card>
          )}

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

      {categoryData && (
        <CategoryBudgetModal
          isVisible={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          category={categoryData}
          currentBudget={budgetAmount}
        />
      )}
    </Modal>
  )
}
