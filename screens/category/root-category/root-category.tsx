import { Icon, type IconName } from '@/components/icon'
import { CategorySelectSQLite } from '@/data/client/db-schema'
import { useCategoryFormModalActions } from '@/lib/storage/category-form-modal-store'
import React from 'react'
import { Text, View } from 'react-native'
import { CategoryCardIcon } from '../category-card-icon'
import { ActionButton } from './action-button'

interface CategoryFormProps {
  category: CategorySelectSQLite
}

export function RootCategory({ category }: CategoryFormProps) {
  const { openCategoryFormModal, openIconModal } = useCategoryFormModalActions()

  const categoryTypeColor =
    category.type === 'income' ? 'text-income' : 'text-expense'
  const categoryTypeBg =
    category.type === 'income'
      ? 'bg-income/5 border-income/10'
      : 'bg-expense/5 border-expense/10'

  return (
    <View className={`rounded-2xl border ${categoryTypeBg} p-6 shadow-sm`}>
      {/* Category Type Badge */}
      <View className="mb-4 flex-row">
        <View className={`rounded-full px-3 py-1 ${categoryTypeBg}`}>
          <Text
            className={`text-xs font-semibold uppercase tracking-wide ${categoryTypeColor}`}
          >
            {category.type}
          </Text>
        </View>
      </View>

      {/* Main Category Info */}
      <View className="mb-6 flex-row items-center">
        <View className="mr-4">
          <CategoryCardIcon name={category.icon} type={category.type} />
        </View>
        <View className="flex-1">
          <Text className="mb-2 text-xl font-bold text-foreground">
            {category.name}
          </Text>
          <Text className="text-base leading-relaxed text-muted-foreground">
            {category.description || 'No description provided'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="gap-3">
        <ActionButton
          onPress={() =>
            openIconModal({
              categoryId: category.id,
              parentId: category.parentId,
              type: category.type
            })
          }
          icon={(() => {
            return category.icon ? (
              <Icon
                name={category.icon as IconName}
                size={18}
                className="text-foreground"
              />
            ) : null
          })()}
          title="Change Icon"
        />

        <ActionButton
          onPress={() =>
            openCategoryFormModal({
              parentId: null,
              categoryId: category.id,
              type: category.type
            })
          }
          icon={
            <Icon
              name="Pencil"
              size={18}
              className="text-foreground"
              strokeWidth={2}
            />
          }
          title="Edit Category"
        />
      </View>
    </View>
  )
}
