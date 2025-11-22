import { Icon } from '@/components/ui/icon-by-name'
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
        <View className="rounded-lg bg-primary/10 p-2">
          <Icon name={icon} size={16} className="text-primary" />
        </View>
        <View>
          <Text className="font-medium text-foreground">{title}</Text>
          <Text className="text-xs text-muted-foreground">{description}</Text>
        </View>
      </View>
    </Link>
  )
}
