import { Text } from '@/components/ui/text'
import {
  useSidebarState,
  useTabsHeaderActions
} from '@/lib/storage/tabs-header-store'
import { GoogleOAuthButton, UserInfo } from '@/modules/session-and-migration'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import React from 'react'
import { DataLossWarning } from '../../modules/session-and-migration/components/data-loss-warning'
import { SidebarModal } from '../modals/sidebar-modal'
import { PowerSyncStatus } from './power-sync-status'
import { Preferences } from './preferences/preferences'

export function SidebarMenu() {
  const visible = useSidebarState()
  const { closeSidebar } = useTabsHeaderActions()

  return (
    <SidebarModal
      visible={visible}
      onRequestClose={closeSidebar}
      footer={
        <Text className="py-4 text-center text-sm text-muted-foreground">
          Breadly v1.0.0
        </Text>
      }
    >
      <SignedOut>
        <GoogleOAuthButton />
        <DataLossWarning />
      </SignedOut>

      <SignedIn>
        <UserInfo />
      </SignedIn>

      <PowerSyncStatus className="mt-4" />

      <Preferences />
    </SidebarModal>
  )
}
