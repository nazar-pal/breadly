import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { useUser } from '@clerk/clerk-expo'
import React from 'react'
import { View } from 'react-native'
import { SignOutButton } from './sign-out-button'

export function UserInfo() {
  const { user } = useUser()
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
      defaultValue="user-info"
      className="native:max-w-md w-full max-w-sm"
    >
      <AccordionItem value="user-info">
        <AccordionTrigger className="rounded-xl border border-border/10 px-4 py-4">
          <Avatar alt={displayName}>
            <AvatarImage source={{ uri: imageUrl }} />
            <AvatarFallback>
              <Text>{displayName.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>

          <View className="ml-4 flex-1">
            <Text className="mb-1 text-lg font-semibold text-popover-foreground">
              {displayName}
            </Text>
            {emails.map((email, idx) => (
              <Text
                key={email}
                className="text-sm text-muted-foreground"
                style={idx > 0 ? { marginTop: 2 } : undefined}
              >
                {email}
              </Text>
            ))}
            {username && (
              <Text className="mt-1 text-xs text-muted-foreground">
                Username: {username}
              </Text>
            )}
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
