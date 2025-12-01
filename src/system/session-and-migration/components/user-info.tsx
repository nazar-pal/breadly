import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { usePurchasesStore } from '@/system/purchases'
import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import { View } from 'react-native'
import { SignOutButton } from './sign-out-button'

export function UserInfo() {
  const { user } = useUser()
  const { isPremium } = usePurchasesStore()
  const { syncEnabled } = useSessionPersistentStore()
  if (!user) return null

  const { firstName, lastName, username, fullName, emailAddresses, imageUrl } =
    user

  // Prefer fullName if available, then first+last, then username, then fallback
  const displayName =
    fullName?.trim() ||
    (firstName || lastName ? `${firstName || ''} ${lastName || ''}` : '') ||
    username ||
    'User'

  // Show all email addresses if more than one, else just the first
  const emails =
    emailAddresses && emailAddresses.length > 0
      ? emailAddresses.map(e => e.emailAddress)
      : ['No email']

  return (
    <Accordion
      type="single"
      collapsible
      className="native:max-w-md w-full max-w-sm"
    >
      <AccordionItem value="user-info">
        <AccordionTrigger className="border-border/10 rounded-xl border px-4 py-4">
          <Avatar alt={displayName}>
            <AvatarImage source={{ uri: imageUrl }} />
            <AvatarFallback>
              <Text>{displayName.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>

          <View className="ml-4 flex-1">
            <Text className="text-popover-foreground mb-1 text-lg font-semibold">
              {displayName}
            </Text>
            {emails.map((email, idx) => (
              <Text
                key={email}
                className="text-muted-foreground text-sm"
                style={idx > 0 ? { marginTop: 2 } : undefined}
              >
                {email}
              </Text>
            ))}
            {username && (
              <Text className="text-muted-foreground mt-1 text-xs">
                Username: {username}
              </Text>
            )}
            <View className="mt-2 flex-row flex-wrap items-center gap-2">
              {isPremium ? (
                <Badge className="border-amber-500/30 bg-amber-500">
                  <Icon name="Crown" size={12} className="text-white" />
                  <Text className="text-xs font-medium text-white">
                    Premium
                  </Text>
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Icon name="Sparkles" size={12} className="text-foreground" />
                  <Text className="text-xs font-medium">Free plan</Text>
                </Badge>
              )}

              {syncEnabled ? (
                <Badge className="border-green-600/30 bg-green-600">
                  <Icon name="CloudCheck" size={12} className="text-white" />
                  <Text className="text-xs font-medium text-white">
                    Cloud sync on
                  </Text>
                </Badge>
              ) : (
                <Badge className="border-red-500/30 bg-red-500/10">
                  <Icon name="CloudOff" size={12} className="text-red-600" />
                  <Text className="text-xs font-medium text-red-700">
                    Local mode only
                  </Text>
                </Badge>
              )}
            </View>
          </View>
        </AccordionTrigger>
        <AccordionContent>
          <View className="mt-4">
            <SignOutButton />
          </View>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
