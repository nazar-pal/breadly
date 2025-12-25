import { Preferences } from '@/components/preferences/preferences'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import * as Application from 'expo-application'
import { router, type Href } from 'expo-router'
import { useState } from 'react'
import { Linking, Pressable, ScrollView, View } from 'react-native'
import {
  DeleteAllDataCard,
  PremiumSection,
  ProfileSection,
  SectionHeader,
  SettingsRow,
  SyncDiagnostics,
  UpdatesRow,
  WelcomeCard
} from './components'

export default function SettingsScreen() {
  return (
    <View className="bg-background flex-1">
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
  const [showSyncDebug, setShowSyncDebug] = useState(false)

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
              <View className="bg-muted mr-3 h-10 w-10 items-center justify-center rounded-full">
                <Icon name="Smartphone" size={18} className="text-primary" />
              </View>
              <View>
                <Text className="font-medium">Breadly</Text>
                <Text className="text-muted-foreground text-sm">
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
            <View className="border-border/30 border-t pt-2">
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
              />

              {/* Hidden sync debug - tap to reveal */}
              <Pressable
                className="flex-row items-center justify-between py-3 active:opacity-70"
                onPress={() => setShowSyncDebug(!showSyncDebug)}
              >
                <View className="flex-row items-center">
                  <View className="bg-muted mr-3 h-10 w-10 items-center justify-center rounded-full">
                    <Icon name="Bug" size={18} className="text-primary" />
                  </View>
                  <View>
                    <Text className="font-medium">Sync Diagnostics</Text>
                    <Text className="text-muted-foreground text-sm">
                      For troubleshooting sync issues
                    </Text>
                  </View>
                </View>
                <Icon
                  name={showSyncDebug ? 'ChevronUp' : 'ChevronDown'}
                  size={18}
                  className="text-muted-foreground"
                />
              </Pressable>

              {showSyncDebug && (
                <View className="mb-2 ml-13">
                  <SyncDiagnostics />
                </View>
              )}
            </View>
          )}
        </CardContent>
      </Card>
    </View>
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
