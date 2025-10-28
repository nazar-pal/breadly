import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { CategoryType } from '@/data/client/db-schema'
import { Link } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

export function SettingsDropdown({ type }: { type: CategoryType }) {
  const categoryType = type

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-4">
          <Icon name="Settings" size={24} className="text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem closeOnPress={true} asChild>
          <Link
            href={{
              pathname: '/edit-categories',
              params: { type: categoryType, archived: 'false' }
            }}
          >
            <View className="flex-row items-center gap-3">
              <View className="rounded-lg bg-primary/10 p-2">
                <Icon name="ListChecks" size={16} className="text-primary" />
              </View>
              <View>
                <Text className="font-medium text-foreground">
                  Edit categories
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Create, rename, and reorder categories
                </Text>
              </View>
            </View>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
