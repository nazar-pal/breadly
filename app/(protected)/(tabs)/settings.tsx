import { SignOutButton } from '@/components/auth'
import { PowerSyncStatus } from '@/components/shared/PowerSyncStatus'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'
import { currencies, useCurrency } from '@/lib/context/CurrencyContext'
import { ChevronRight, DollarSign, Moon, Sun, User } from '@/lib/icons'
import { useColorScheme } from '@/lib/useColorScheme'
import { cn } from '@/lib/utils'
import { SignedIn, useUser } from '@clerk/clerk-expo'
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
}

function SettingsItem({
  icon,
  title,
  subtitle,
  rightElement,
  onPress,
  showBorder = true
}: SettingsItemProps) {
  const Container = onPress ? Pressable : View

  return (
    <>
      <Container
        className={cn(
          'flex-row items-center justify-between py-3',
          onPress && 'active:opacity-70'
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
  const { colorScheme, setColorScheme } = useColorScheme()
  const { currency, setCurrency } = useCurrency()
  const { user } = useUser()
  const insets = useSafeAreaInsets()

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false)

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

        <SettingsSection title="Preferences" className="mt-6">
          <SettingsItem
            icon={<DollarSign size={20} className="text-primary" />}
            title="Default Currency"
            subtitle={`${currency.name} (${currency.symbol})`}
            rightElement={
              <ChevronRight size={20} className="text-muted-foreground" />
            }
            onPress={() => setShowCurrencyModal(!showCurrencyModal)}
          />

          <SettingsItem
            icon={<Sun size={20} className="text-primary" />}
            title="Light Mode"
            rightElement={
              <Switch
                checked={colorScheme === 'light'}
                onCheckedChange={checked =>
                  setColorScheme(checked ? 'light' : 'dark')
                }
              />
            }
          />

          <SettingsItem
            icon={<Moon size={20} className="text-primary" />}
            title="Dark Mode"
            rightElement={
              <Switch
                checked={colorScheme === 'dark'}
                onCheckedChange={checked =>
                  setColorScheme(checked ? 'dark' : 'light')
                }
              />
            }
            showBorder={false}
          />
        </SettingsSection>

        {showCurrencyModal && (
          <Card className="mt-2">
            <CardContent>
              <Text className="mb-3 text-base font-semibold text-foreground">
                Select Currency
              </Text>
              {currencies.map(curr => (
                <Pressable
                  key={curr.code}
                  className={cn(
                    'mb-1 flex-row items-center justify-between rounded-lg p-3',
                    curr.code === currency.code && 'bg-primary'
                  )}
                  onPress={() => {
                    setCurrency(curr)
                    setShowCurrencyModal(false)
                  }}
                >
                  <Text
                    className={cn(
                      'text-base',
                      curr.code === currency.code
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    )}
                  >
                    {curr.symbol} - {curr.name}
                  </Text>
                  {curr.code === currency.code && (
                    <View className="h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                </Pressable>
              ))}
            </CardContent>
          </Card>
        )}

        <Text className="mt-6 text-center text-sm text-muted-foreground">
          Breadly v1.0.0
        </Text>
      </ScrollView>
    </View>
  )
}
