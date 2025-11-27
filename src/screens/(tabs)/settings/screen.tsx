import { Preferences } from '@/components/preferences/preferences'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Icon, type IconName } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useSessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import { usePurchasesStore } from '@/system/purchases'
import { GoogleOAuthButton } from '@/system/session-and-migration'
import { DataLossWarning } from '@/system/session-and-migration/components/data-loss-warning'
import { SignOutButton } from '@/system/session-and-migration/components/sign-out-button'
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { useStatus } from '@powersync/react-native'
import * as Application from 'expo-application'
import { LinearGradient } from 'expo-linear-gradient'
import { router, type Href } from 'expo-router'
import * as Updates from 'expo-updates'
import { useState } from 'react'
import { Linking, Pressable, ScrollView, View } from 'react-native'
import { DeleteAllDataCard } from './components/delete-all-data'

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-10 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="native:max-w-md mx-auto w-full max-w-sm gap-6">
          <SignedOut>
            <WelcomeCard />
          </SignedOut>

          <SignedIn>
            <ProfileSection />
            <PremiumSection />
          </SignedIn>

          <PreferencesSection />
          <DataSection />
          <AboutSection />
          <DangerSection />
        </View>
      </ScrollView>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ title, icon }: { title: string; icon?: IconName }) {
  return (
    <View className="mb-3 flex-row items-center gap-2">
      {icon && <Icon name={icon} size={16} className="text-muted-foreground" />}
      <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </Text>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WELCOME CARD (SIGNED OUT)
// ─────────────────────────────────────────────────────────────────────────────

function WelcomeCard() {
  return (
    <View className="overflow-hidden rounded-2xl shadow-lg">
      <LinearGradient
        colors={['#7c3aed', '#4338ca']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16 }}
      >
        <View className="px-6 py-6">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Icon name="Wallet" size={24} className="text-white" />
          </View>

          <Text className="mb-2 text-xl font-bold text-white">
            Take control of your finances
          </Text>
          <Text className="mb-6 text-sm leading-relaxed text-white/80">
            Sign in to unlock cloud sync, access your data across devices, and
            never lose track of your spending.
          </Text>

          <GoogleOAuthButton />
          <DataLossWarning />
        </View>
      </LinearGradient>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE SECTION (SIGNED IN)
// ─────────────────────────────────────────────────────────────────────────────

function ProfileSection() {
  const { user } = useUser()
  const { isPremium } = usePurchasesStore()
  const { syncEnabled } = useSessionPersistentStore()
  const status = useStatus()

  if (!user) return null

  const displayName =
    user.fullName?.trim() ||
    (user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : '') ||
    user.username ||
    'User'

  const email = user.emailAddresses?.[0]?.emailAddress || 'No email'

  const getSyncLabel = () => {
    if (!syncEnabled) return { label: 'Sync off', color: 'gray' as const }
    if (status.connecting)
      return { label: 'Connecting…', color: 'blue' as const }
    if (status.connected) return { label: 'Synced', color: 'green' as const }
    return { label: 'Offline', color: 'gray' as const }
  }

  const syncInfo = getSyncLabel()

  return (
    <View>
      <Card>
        <CardContent className="py-4">
          <View className="flex-row items-center">
            <View className="mr-4 overflow-hidden rounded-full">
              <LinearGradient
                colors={['#8b5cf6', '#4f46e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text className="text-xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </View>

            <View className="flex-1">
              <Text className="text-lg font-semibold">{displayName}</Text>
              <Text className="text-sm text-muted-foreground">{email}</Text>

              <View className="mt-2 flex-row flex-wrap gap-1.5">
                {isPremium ? (
                  <Badge className="border-amber-500/30 bg-amber-500">
                    <Icon name="Crown" size={10} className="text-white" />
                    <Text className="text-[10px] font-medium text-white">
                      Premium
                    </Text>
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Text className="text-[10px] font-medium">Free</Text>
                  </Badge>
                )}

                <Badge
                  variant="secondary"
                  className={
                    syncInfo.color === 'green'
                      ? 'border-green-500/30 bg-green-500/10'
                      : syncInfo.color === 'blue'
                        ? 'border-blue-500/30 bg-blue-500/10'
                        : ''
                  }
                >
                  <View
                    className={`h-1.5 w-1.5 rounded-full ${
                      syncInfo.color === 'green'
                        ? 'bg-green-500'
                        : syncInfo.color === 'blue'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                    }`}
                  />
                  <Text
                    className={`text-[10px] font-medium ${
                      syncInfo.color === 'green'
                        ? 'text-green-700 dark:text-green-400'
                        : syncInfo.color === 'blue'
                          ? 'text-blue-700 dark:text-blue-400'
                          : ''
                    }`}
                  >
                    {syncInfo.label}
                  </Text>
                </Badge>
              </View>
            </View>
          </View>

          <View className="mt-4 border-t border-border/50 pt-4">
            <SignOutButton />
          </View>
        </CardContent>
      </Card>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM SECTION
// ─────────────────────────────────────────────────────────────────────────────

function PremiumSection() {
  const { isPremium } = usePurchasesStore()
  const { isSignedIn } = useAuth()
  const { syncEnabled } = useSessionPersistentStore()

  if (!isSignedIn || isPremium) return null

  return (
    <Pressable
      onPress={() => router.push('/paywall' as Href)}
      className="overflow-hidden rounded-xl border border-violet-500/20 bg-violet-50 active:opacity-90 dark:bg-violet-950/30"
    >
      <View className="flex-row items-center px-4 py-4">
        <View className="mr-3 overflow-hidden rounded-xl">
          <LinearGradient
            colors={['#8b5cf6', '#4f46e5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name="Sparkles" size={18} className="text-white" />
          </LinearGradient>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-violet-900 dark:text-violet-200">
            Upgrade to Premium
          </Text>
          <Text className="text-sm text-violet-700 dark:text-violet-400">
            Unlock cloud sync & advanced features
          </Text>
        </View>
        <Icon
          name="ChevronRight"
          size={20}
          className="text-violet-400 dark:text-violet-500"
        />
      </View>

      {!syncEnabled && (
        <View className="flex-row items-center gap-2 border-t border-violet-200/50 bg-amber-50/50 px-4 py-2.5 dark:border-violet-800/30 dark:bg-amber-950/20">
          <Icon
            name="AlertTriangle"
            size={14}
            className="text-amber-600 dark:text-amber-400"
          />
          <Text className="flex-1 text-xs text-amber-700 dark:text-amber-300">
            Your data is only stored locally
          </Text>
        </View>
      )}
    </Pressable>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PREFERENCES SECTION
// ─────────────────────────────────────────────────────────────────────────────

function PreferencesSection() {
  return (
    <View>
      <SectionHeader title="Preferences" icon="Settings2" />
      <Preferences />
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA SECTION
// ─────────────────────────────────────────────────────────────────────────────

function DataSection() {
  return (
    <View>
      <SectionHeader title="Data" icon="Database" />
      <Card>
        <CardContent className="gap-1 py-2">
          <SettingsRow
            icon="Folders"
            title="Import Categories"
            subtitle="Add from CSV file"
            onPress={() => router.push('/import/categories' as Href)}
          />
          <SettingsRow
            icon="ArrowLeftRight"
            title="Import Transactions"
            subtitle="Add from CSV file"
            onPress={() => router.push('/import/transactions' as Href)}
            showDivider={false}
          />
        </CardContent>
      </Card>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────────────────────────────────────

function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  const appVersion = Application.nativeApplicationVersion || '1.0.0'
  const buildVersion = Application.nativeBuildVersion || '1'

  return (
    <View>
      <SectionHeader title="About" icon="Info" />
      <Card>
        <CardContent className="py-2">
          <Pressable
            className="flex-row items-center justify-between py-3"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Icon name="Smartphone" size={18} className="text-primary" />
              </View>
              <View>
                <Text className="font-medium">Breadly</Text>
                <Text className="text-sm text-muted-foreground">
                  v{appVersion} ({buildVersion})
                </Text>
              </View>
            </View>
            <Icon
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              size={18}
              className="text-muted-foreground"
            />
          </Pressable>

          {isExpanded && (
            <View className="border-t border-border/30 pt-2">
              <UpdatesRow />
              <SettingsRow
                icon="FileText"
                title="Privacy Policy"
                onPress={() => router.push('/privacy-policy' as Href)}
              />
              <SettingsRow
                icon="ExternalLink"
                title="Terms of Service"
                onPress={() => Linking.openURL('https://breadly.app/terms')}
                showDivider={false}
              />
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  )
}

function UpdatesRow() {
  const updates = Updates.useUpdates()
  const isDisabled = __DEV__ || !Updates.isEnabled

  if (isDisabled) return null

  const { isUpdateAvailable, isUpdatePending } = updates

  const getUpdateStatus = () => {
    if (isUpdatePending) return { label: 'Restart to update', color: 'green' }
    if (isUpdateAvailable) return { label: 'Update available', color: 'blue' }
    return { label: 'Up to date', color: 'gray' }
  }

  const status = getUpdateStatus()

  const handlePress = async () => {
    if (isUpdatePending) {
      await Updates.reloadAsync()
    } else if (isUpdateAvailable) {
      await Updates.fetchUpdateAsync()
    } else {
      await Updates.checkForUpdateAsync()
    }
  }

  return (
    <Pressable
      className="flex-row items-center justify-between border-b border-border/30 py-3 active:opacity-70"
      onPress={handlePress}
    >
      <View className="flex-row items-center">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Icon name="RefreshCw" size={18} className="text-primary" />
        </View>
        <Text className="font-medium">App Updates</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View
          className={`h-2 w-2 rounded-full ${
            status.color === 'green'
              ? 'bg-green-500'
              : status.color === 'blue'
                ? 'bg-blue-500'
                : 'bg-gray-400'
          }`}
        />
        <Text className="text-sm text-muted-foreground">{status.label}</Text>
      </View>
    </Pressable>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DANGER SECTION
// ─────────────────────────────────────────────────────────────────────────────

function DangerSection() {
  return (
    <View>
      <SectionHeader title="Danger Zone" icon="AlertTriangle" />
      <DeleteAllDataCard />
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  showDivider = true,
  rightElement
}: {
  icon: IconName
  title: string
  subtitle?: string
  onPress?: () => void
  showDivider?: boolean
  rightElement?: React.ReactNode
}) {
  return (
    <Pressable
      className={`flex-row items-center py-3 active:opacity-70 ${
        showDivider ? 'border-b border-border/30' : ''
      }`}
      onPress={onPress}
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Icon name={icon} size={18} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="font-medium">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-muted-foreground">{subtitle}</Text>
        )}
      </View>
      {rightElement || (
        <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
      )}
    </Pressable>
  )
}
