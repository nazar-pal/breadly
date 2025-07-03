import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { AlignLeft } from '@/lib/icons'
import { useTabsHeaderActions } from '@/lib/storage/tabs-header-store'
import { useUser } from '@clerk/clerk-expo'
import { Pressable } from 'react-native'

export function SidebarTrigger() {
  const { user } = useUser()
  const { openSidebar } = useTabsHeaderActions()

  if (!user) {
    return (
      <Pressable
        onPress={openSidebar}
        className="ml-4 rounded-full p-2 active:bg-muted active:opacity-70"
      >
        <AlignLeft size={24} className="text-foreground" />
      </Pressable>
    )
  }

  const { firstName, lastName, username, fullName, imageUrl } = user

  // Create initials from name or username
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (fullName) {
      const names = fullName.trim().split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return fullName[0].toUpperCase()
    }
    if (username) {
      return username[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <Pressable
      onPress={openSidebar}
      className="ml-4 rounded-full p-1 active:opacity-70"
    >
      <Avatar alt={fullName || username || 'User Avatar'} className="h-8 w-8">
        <AvatarImage source={{ uri: imageUrl }} />
        <AvatarFallback>
          <Text className="text-xs font-medium">{getInitials()}</Text>
        </AvatarFallback>
      </Avatar>
    </Pressable>
  )
}
