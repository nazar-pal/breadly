import { SignOutButton } from '@/components/auth/SignOutButton'
import Button from '@/components/ui-old/Button'
import Card from '@/components/ui-old/Card'
import { currencies, useCurrency } from '@/context/CurrencyContext'
import {
  useTheme,
  useThemedStyles,
  type ThemePreference
} from '@/context/ThemeContext'
import { useColorScheme } from '@/lib/useColorScheme'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import {
  ChevronRight,
  DollarSign,
  Moon,
  Smartphone,
  Sun,
  User
} from 'lucide-react-native'
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Create themed styles using the new useThemedStyles hook
const createThemedStyles = () =>
  StyleSheet.create({
    authButtons: {
      gap: 8
    }
  })

export default function SettingsScreen() {
  const { colors, preference, isLoading } = useTheme()

  const { setColorScheme } = useColorScheme()

  const { currency, setCurrency } = useCurrency()
  const { user } = useUser()
  const insets = useSafeAreaInsets()
  const themedStyles = useThemedStyles(createThemedStyles)

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false)

  // Handle theme preference change
  const handleThemeChange = async (newPreference: ThemePreference) => {
    try {
      setColorScheme(newPreference)
    } catch (error) {
      console.error('Failed to update theme:', error)
      // You might want to show an error toast here
    }
  }

  // Show loading indicator while theme is loading
  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background, paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.background, paddingTop: insets.top }}
    >
      <View className="px-4 py-4">
        <Text className="text-[28px] font-bold" style={{ color: colors.text }}>
          Settings
        </Text>
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
            <View className="mb-4 flex-row items-center">
              <View
                className="h-[60px] w-[60px] items-center justify-center rounded-[30px]"
                style={{ backgroundColor: colors.iconBackground.neutral }}
              >
                <User size={32} color={colors.text} />
              </View>
              <View className="ml-4">
                <Text
                  className="mb-1 text-lg font-semibold"
                  style={{ color: colors.text }}
                >
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || 'User'}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {user?.emailAddresses[0]?.emailAddress || 'No email'}
                </Text>
              </View>
            </View>
            <View
              className="my-4 h-px w-full"
              style={{ backgroundColor: colors.border }}
            />
            <SignOutButton />
          </Card>
        </SignedIn>

        <SignedOut>
          <Card>
            <View className="py-2">
              <Text
                className="mb-2 text-lg font-semibold"
                style={{ color: colors.text }}
              >
                Sign in to access your account
              </Text>
              <Text
                className="mb-4 text-sm leading-5"
                style={{ color: colors.textSecondary }}
              >
                Sign in or create an account to sync your data across devices
              </Text>
              <View style={themedStyles.authButtons}>
                <Link href="/sign-in" asChild>
                  <Button>Sign In</Button>
                </Link>
                <Link href="/sign-up" asChild>
                  <Button variant="secondary">Sign Up</Button>
                </Link>
              </View>
            </View>
          </Card>
        </SignedOut>

        <Text
          className="my-4 mt-6 text-lg font-semibold"
          style={{ color: colors.text }}
        >
          Preferences
        </Text>
        <Card>
          <Pressable
            className="flex-row items-center justify-between py-3"
            onPress={() => setShowCurrencyModal(!showCurrencyModal)}
          >
            <View className="flex-1 flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]"
                style={{ backgroundColor: colors.iconBackground.warning }}
              >
                <DollarSign size={20} color={colors.warning} />
              </View>
              <View>
                <Text className="text-base" style={{ color: colors.text }}>
                  Default Currency
                </Text>
                <Text
                  className="mt-0.5 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {currency.name} ({currency.symbol})
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>

          <View className="h-px" style={{ backgroundColor: colors.border }} />

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]"
                style={{ backgroundColor: colors.iconBackground.warning }}
              >
                <Sun size={20} color={colors.warning} />
              </View>
              <Text className="text-base" style={{ color: colors.text }}>
                Light Mode
              </Text>
            </View>
            <Switch
              value={preference === 'light'}
              onValueChange={value =>
                handleThemeChange(value ? 'light' : 'system')
              }
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="h-px" style={{ backgroundColor: colors.border }} />

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]"
                style={{ backgroundColor: colors.iconBackground.info }}
              >
                <Moon size={20} color={colors.info} />
              </View>
              <Text className="text-base" style={{ color: colors.text }}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={preference === 'dark'}
              onValueChange={value =>
                handleThemeChange(value ? 'dark' : 'system')
              }
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="h-px" style={{ backgroundColor: colors.border }} />

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-[20px]"
                style={{ backgroundColor: colors.iconBackground.primary }}
              >
                <Smartphone size={20} color={colors.primary} />
              </View>
              <Text className="text-base" style={{ color: colors.text }}>
                Use System Settings
              </Text>
            </View>
            <Switch
              value={preference === 'system'}
              onValueChange={value =>
                handleThemeChange(value ? 'system' : 'light')
              }
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {showCurrencyModal && (
          <Card className="mt-2">
            <Text
              className="mb-3 text-base font-semibold"
              style={{ color: colors.text }}
            >
              Select Currency
            </Text>
            {currencies.map(curr => (
              <Pressable
                key={curr.code}
                className="mb-1 flex-row items-center justify-between rounded-lg p-3"
                style={
                  curr.code === currency.code
                    ? { backgroundColor: colors.primary }
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
                    color: curr.code === currency.code ? '#FFFFFF' : colors.text
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
          </Card>
        )}

        <Text
          className="mt-6 text-center text-sm"
          style={{ color: colors.textSecondary }}
        >
          Breadly v1.0.0
        </Text>
      </ScrollView>
    </View>
  )
}
