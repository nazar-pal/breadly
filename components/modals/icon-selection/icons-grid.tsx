import { type IconName } from '@/components/ui/icon-by-name'
import React from 'react'
import { Text, View } from 'react-native'
import { IconButton } from './icon-button'
import { expenseIcons, incomeIcons } from './lib/'

type CategoryType = 'income' | 'expense'

interface Props {
  categoryType: CategoryType
  selectedIcon: IconName
  onIconSelect: (iconName: IconName) => void
}

export function IconsGrid({ categoryType, selectedIcon, onIconSelect }: Props) {
  const iconNames = categoryType === 'income' ? incomeIcons : expenseIcons

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-foreground">
          Choose Icon
        </Text>
        <Text className="text-xs font-medium text-muted-foreground">
          Selected: {selectedIcon}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'flex-start'
        }}
      >
        {iconNames.map(iconName => (
          <IconButton
            key={iconName}
            iconName={iconName}
            isSelected={selectedIcon === iconName}
            categoryType={categoryType}
            onPress={onIconSelect}
          />
        ))}
      </View>
    </View>
  )
}
