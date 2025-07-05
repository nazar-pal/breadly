import { Button } from '@/components/ui/button'
import { SquarePen } from '@/lib/icons'
import { Link } from 'expo-router'
import React from 'react'

export function SettingsDropdown() {
  return (
    <Link href="/categories/edit/expense" asChild>
      <Button variant="ghost" size="icon" className="mr-4">
        <SquarePen size={24} className="text-foreground" />
      </Button>
    </Link>
  )
}
