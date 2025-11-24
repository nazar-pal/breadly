import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon-by-name'
import { CategoryType } from '@/data/client/db-schema'
import React from 'react'
import { SettingsDropdownLinkItem } from './settings-dropdown-link-item'

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
          <SettingsDropdownLinkItem
            href={{
              pathname: '/edit-categories',
              params: { type: categoryType, archived: 'false' }
            }}
            icon="ListChecks"
            title="Edit categories"
            description="Create, rename, and reorder categories"
          />
        </DropdownMenuItem>

        <DropdownMenuItem closeOnPress={true} asChild>
          <SettingsDropdownLinkItem
            href={{
              pathname: '/import/categories',
              params: { type: categoryType }
            }}
            icon="Import"
            title="Import categories"
            description="Import categories from a file"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
