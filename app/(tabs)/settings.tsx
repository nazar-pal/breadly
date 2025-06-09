import { SignOutButton } from '@/components/auth/SignOutButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { currencies, useCurrency } from '@/context/CurrencyContext'
import { useColorScheme } from '@/lib/useColorScheme'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { ChevronRight, DollarSign, Moon, Sun, User } from 'lucide-react-native'
import React from 'react'
import { Pressable, ScrollView, Switch, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme()
  const { currency, setCurrency } = useCurrency()
  const { user } = useUser()
  const insets = useSafeAreaInsets()

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false)

  // Handle theme change - only light/dark supported
  const handleThemeChange = (newScheme: 'light' | 'dark') => {
    setColorScheme(newScheme)
  }

  return (
    <View className="bg-background flex-1" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4">
        <Text className="text-foreground text-[28px] font-bold">Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32
        }}
      >
        <SignedIn>
          <Card>
            <CardContent>
              <View className="mb-4 flex-row items-center">
                <View className="h-[60px] w-[60px] items-center justify-center rounded-[30px]">
                  <User size={32} color="#1A202C" />
                </View>
                <View className="ml-4">
                  <Text className="text-foreground mb-1 text-lg font-semibold">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username || 'User'}
                  </Text>
                  <Text className="text-foreground text-sm">
                    {user?.emailAddresses[0]?.emailAddress || 'No email'}
                  </Text>
                </View>
              </View>
              <View className="bg-border my-4 h-px w-full" />
              <SignOutButton />
            </CardContent>
          </Card>
        </SignedIn>

        <SignedOut>
          <Card>
            <CardContent>
              <View className="py-2">
                <Text className="text-foreground mb-2 text-lg font-semibold">
                  Sign in to access your account
                </Text>
                <Text className="text-foreground mb-4 text-sm leading-5">
                  Sign in or create an account to sync your data across devices
                </Text>
                <View className="gap-2">
                  <Link href="/sign-in" asChild>
                    <Button className="w-full">
                      <Text>Sign In</Text>
                    </Button>
                  </Link>
                  <Link href="/sign-up" asChild>
                    <Button variant="secondary" className="w-full">
                      <Text>Sign Up</Text>
                    </Button>
                  </Link>
                </View>
              </View>
            </CardContent>
          </Card>
        </SignedOut>

        <Text className="text-foreground my-4 mt-6 text-lg font-semibold">
          Preferences
        </Text>
        <Card>
          <CardContent>
            <Pressable
              className="flex-row items-center justify-between py-3"
              onPress={() => setShowCurrencyModal(!showCurrencyModal)}
            >
              <View className="flex-1 flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]">
                  <DollarSign size={20} color="#F59E0B" />
                </View>
                <View>
                  <Text className="text-foreground text-base">
                    Default Currency
                  </Text>
                  <Text className="text-foreground mt-0.5 text-sm">
                    {currency.name} ({currency.symbol})
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#4A5568" />
            </Pressable>

            <View className="bg-border h-px" />

            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]">
                  <Sun size={20} color="#F59E0B" />
                </View>
                <Text className="text-foreground text-base">Light Mode</Text>
              </View>
              <Switch
                value={colorScheme === 'light'}
                onValueChange={value =>
                  handleThemeChange(value ? 'light' : 'dark')
                }
                trackColor={{ false: '#E2E8F0', true: '#6366F1' }} // colors.secondary : colors.primary
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="bg-border h-px" />

            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]">
                  <Moon size={20} color="#3B82F6" />
                </View>
                <Text className="text-foreground text-base">Dark Mode</Text>
              </View>
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={value =>
                  handleThemeChange(value ? 'dark' : 'light')
                }
                trackColor={{ false: '#E2E8F0', true: '#6366F1' }} // colors.secondary : colors.primary
                thumbColor="#FFFFFF"
              />
            </View>
          </CardContent>
        </Card>

        {showCurrencyModal && (
          <Card className="mt-2">
            <CardContent>
              <Text className="text-foreground mb-3 text-base font-semibold">
                Select Currency
              </Text>
              {currencies.map(curr => (
                <Pressable
                  key={curr.code}
                  className="mb-1 flex-row items-center justify-between rounded-lg p-3"
                  style={
                    curr.code === currency.code
                      ? { backgroundColor: '#6366F1' }
                      : undefined
                  }
                  onPress={() => {
                    setCurrency(curr)
                    setShowCurrencyModal(false)
                  }}
                >
                  <Text
                    className="text-base"
                    style={{
                      color: curr.code === currency.code ? '#FFFFFF' : '#1A202C' // colors.text
                    }}
                  >
                    {curr.symbol} - {curr.name}
                  </Text>
                  {curr.code === currency.code && (
                    <View
                      className="rounded-1 h-2 w-2"
                      style={{ backgroundColor: '#FFFFFF' }}
                    />
                  )}
                </Pressable>
              ))}
            </CardContent>
          </Card>
        )}

        <Text className="text-foreground mt-6 text-center text-sm">
          Breadly v1.0.0
        </Text>
      </ScrollView>
    </View>
  )
}
