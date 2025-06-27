import { SignOutButton } from '@/components/auth'
import { Preferences } from '@/components/settings/preferences'
import { MigrationPreview } from '@/components/shared/migration-preview'
import { PowerSyncStatus } from '@/components/shared/power-sync-status'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { ChevronRight, Shield, User, UserPlus } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

function SettingsSection({ title, children, className }: SettingsSectionProps) {
  return (
    <View className={className}>
      <Text className="mb-4 text-lg font-semibold text-foreground">
        {title}
      </Text>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </View>
  )
}

interface SettingsItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  rightElement?: React.ReactNode
  onPress?: () => void
  showBorder?: boolean
  className?: string
}

function SettingsItem({
  icon,
  title,
  subtitle,
  rightElement,
  className,
  onPress,
  showBorder = true
}: SettingsItemProps) {
  const Container = onPress ? Pressable : View

  return (
    <>
      <Container
        className={cn(
          'flex-row items-center justify-between py-3',
          onPress && 'active:opacity-70',
          className
        )}
        onPress={onPress}
      >
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-secondary">
            {icon}
          </View>
          <View>
            <Text className="text-base text-foreground">{title}</Text>
            {subtitle && (
              <Text className="mt-0.5 text-sm text-muted-foreground">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement}
      </Container>
      {showBorder && <View className="h-px bg-border" />}
    </>
  )
}

export default function SettingsScreen() {
  const { user } = useUser()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4">
        <Text className="text-3xl font-bold text-foreground">Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32
        }}
      >
        {/* Authentication Section - Only show for guest users */}
        <SignedOut>
          <SettingsSection title="Create Account">
            <SettingsItem
              icon={<UserPlus size={20} className="text-primary" />}
              title="Sign Up & Save Your Data"
              subtitle="Create an account to sync your data to the cloud"
              rightElement={
                <ChevronRight size={20} className="text-muted-foreground" />
              }
              onPress={() => router.push('/auth')}
            />
            <SettingsItem
              className="pb-0"
              icon={<Shield size={20} className="text-primary" />}
              title="Sign In"
              subtitle="Already have an account? Sign in here"
              rightElement={
                <ChevronRight size={20} className="text-muted-foreground" />
              }
              onPress={() => router.push('/auth')}
              showBorder={false}
            />
          </SettingsSection>
        </SignedOut>

        <SignedIn>
          <SettingsSection title="Account">
            <View className="mb-4 flex-row items-center">
              <View className="h-[60px] w-[60px] items-center justify-center rounded-full bg-secondary">
                <User size={32} className="text-foreground" />
              </View>
              <View className="ml-4">
                <Text className="mb-1 text-lg font-semibold text-foreground">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || 'User'}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {user?.emailAddresses[0]?.emailAddress || 'No email'}
                </Text>
              </View>
            </View>
            <View className="my-4 h-px w-full bg-border" />
            <SignOutButton />
          </SettingsSection>
        </SignedIn>

        <PowerSyncStatus />

        <MigrationPreview />

        <Preferences />

        <Text className="mt-6 text-center text-sm text-muted-foreground">
          Breadly v1.0.0
        </Text>
      </ScrollView>
    </View>
  )
}
