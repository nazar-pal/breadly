import { Icon, type IconName } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

interface CategoryBadgeProps {
  parentName?: string | null
  parentIcon?: string | null
  childName?: string | null
  childIcon?: string | null
}

export function CategoryBadge({
  parentName,
  parentIcon,
  childName,
  childIcon
}: CategoryBadgeProps) {
  if (!parentName && !childName) {
    return (
      <View className="rounded-full bg-muted/60 px-2.5 py-1">
        <Text className="text-xs font-medium text-muted-foreground">
          Uncategorized
        </Text>
      </View>
    )
  }

  // Only child category
  if (!parentName && childName) {
    return (
      <View className="flex-row items-center rounded-full bg-muted/60 px-2.5 py-1">
        <Icon
          name={(childIcon as IconName) || 'Tag'}
          size={12}
          className="text-muted-foreground"
        />
        <Text className="ml-1.5 text-xs font-medium text-muted-foreground">
          {childName}
        </Text>
      </View>
    )
  }

  // Parent + child hierarchy
  return (
    <View className="flex-row items-center gap-1">
      <View className="flex-row items-center rounded-full bg-muted/60 px-2.5 py-1">
        <Icon
          name={(parentIcon as IconName) || 'Folder'}
          size={12}
          className="text-muted-foreground"
        />
        <Text className="ml-1.5 text-xs font-medium text-muted-foreground">
          {parentName}
        </Text>
      </View>
      <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
      <View className="flex-row items-center rounded-full bg-muted/60 px-2.5 py-1">
        <Icon
          name={(childIcon as IconName) || 'Tag'}
          size={12}
          className="text-muted-foreground"
        />
        <Text className="ml-1.5 text-xs font-medium text-muted-foreground">
          {childName}
        </Text>
      </View>
    </View>
  )
}

