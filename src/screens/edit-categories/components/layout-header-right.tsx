import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon-by-name'
import { router } from 'expo-router'
import React from 'react'

export function LayoutHeaderRight({ archived }: { archived: boolean }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={() =>
        router.setParams({ archived: archived ? 'false' : 'true' })
      }
    >
      {archived ? (
        <Icon name="ArchiveRestore" size={24} className="text-foreground" />
      ) : (
        <Icon name="Archive" size={24} className="text-foreground" />
      )}
    </Button>
  )
}
