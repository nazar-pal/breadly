import { Icon } from '@/components/icon'
import { CategorySelectSQLite } from '@/data/client/db-schema'
import { cn } from '@/lib/utils'
import React, { ComponentProps } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { CategoryCardIcon } from './category-card-icon'

interface Props extends ComponentProps<typeof TouchableOpacity> {
  category: CategorySelectSQLite
  className?: string
}

export function CategoryCard({ category, className, ...props }: Props) {
  return (
    <TouchableOpacity
      className={cn(
        'relative flex-row items-center rounded-xl border border-border/50 bg-muted/30 p-2',
        className
      )}
      delayLongPress={400}
      activeOpacity={0.6}
      {...props}
    >
      <CategoryCardIcon name={category.icon} type={category.type} />

      <View className="ml-3 flex-1">
        <Text
          numberOfLines={1}
          className="mb-0.5 text-sm font-semibold text-foreground"
        >
          {category.name}
        </Text>
        <Text numberOfLines={1} className="text-[13px] text-muted-foreground">
          {category.description}
        </Text>
      </View>

      <View className="rounded-lg border border-primary/20 bg-primary/15 p-1.5 backdrop-blur-md">
        <Icon
          name="Pencil"
          size={13}
          className="text-primary"
          strokeWidth={2.5}
        />
      </View>
    </TouchableOpacity>
  )
}
