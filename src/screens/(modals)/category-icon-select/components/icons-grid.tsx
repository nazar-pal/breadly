import { type IconName } from '@/components/ui/icon-by-name'
import React from 'react'
import { Text, View } from 'react-native'
import { getCategoriesForCategoryType } from '../lib'
import { IconButton } from './icon-button'

type CategoryType = 'income' | 'expense'

interface Props {
  categoryType: CategoryType
  selectedIcon: IconName
  onIconSelect: (iconName: IconName) => void
}

export function IconsGrid({ categoryType, selectedIcon, onIconSelect }: Props) {
  const categories = getCategoriesForCategoryType(categoryType)

  return (
    <View className="gap-6">
      {categories.map(category => (
        <View key={category.id}>
          <Text className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
            {category.name}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {category.icons.map(iconName => (
              <IconButton
                key={`${category.id}-${iconName}`}
                iconName={iconName}
                isSelected={selectedIcon === iconName}
                categoryType={categoryType}
                onPress={onIconSelect}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}
