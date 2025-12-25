import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { Link, LinkProps } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

interface Props extends LinkProps {
  icon: string
  title: string
  description: string
}

export function SettingsDropdownLinkItem({
  icon,
  title,
  description,
  ...linkProps
}: Props) {
  return (
    <Link {...linkProps}>
      <View className="flex-row items-center gap-3">
        <View className="bg-primary/10 rounded-lg p-2">
          <Icon name={icon} size={16} className="text-primary" />
        </View>
        <View>
          <Text className="text-foreground font-medium">{title}</Text>
          <Text className="text-muted-foreground text-xs">{description}</Text>
        </View>
      </View>
    </Link>
  )
}
