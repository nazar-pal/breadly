import { Icon } from '@/components/ui/lucide-icon-by-name'
import { CategorySelectSQLite } from '@/data/client/db-schema'
import { cn } from '@/lib/utils'
import React, { ComponentProps } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { CategoryCardIcon } from '../category-card-icon'

interface Props extends ComponentProps<typeof TouchableOpacity> {
  category: CategorySelectSQLite
  className?: string
}

export function CategoryCard({ category, className, ...props }: Props) {
  return (
    <TouchableOpacity
      className={cn(
        'border-border/50 bg-muted/30 relative flex-row items-center rounded-xl border p-2',
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
          className="text-foreground mb-0.5 text-sm font-semibold"
        >
          {category.name}
        </Text>
        <Text numberOfLines={1} className="text-muted-foreground text-[13px]">
          {category.description}
        </Text>
      </View>

      <View className="border-primary/20 bg-primary/15 rounded-lg border p-1.5 backdrop-blur-md">
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
