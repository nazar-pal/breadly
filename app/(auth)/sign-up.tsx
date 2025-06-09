import Button from '@/components/ui-old/Button'
import Card from '@/components/ui-old/Card'
import { useTheme } from '@/context/ThemeContext'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Lock, Mail, Shield, UserPlus } from 'lucide-react-native'
import * as React from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const onSignUpPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    try {
      await signUp.create({
        emailAddress,
        password
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert(
        'Error',
        err.errors?.[0]?.message ||
          'Failed to create account. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
        Alert.alert('Error', 'Verification failed. Please try again.')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert(
        'Error',
        err.errors?.[0]?.message || 'Verification failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="px-4"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingTop: insets.top + 32,
            paddingBottom: insets.bottom + 32
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 items-center">
            <View
              className="mb-6 h-20 w-20 items-center justify-center rounded-[40px]"
              style={{ backgroundColor: colors.primary }}
            >
              <Shield size={32} color={colors.textInverse} />
            </View>
            <Text
              className="mb-2 text-[28px] font-bold"
              style={{ color: colors.text }}
            >
              Verify Your Email
            </Text>
            <Text
              className="text-center text-base leading-6"
              style={{ color: colors.textSecondary }}
            >
              We sent a verification code to {emailAddress}
            </Text>
          </View>

          <Card className="mb-6">
            <View className="mb-5">
              <Text
                className="mb-2 text-base font-semibold"
                style={{ color: colors.text }}
              >
                Verification Code
              </Text>
              <View
                className="h-14 flex-row items-center rounded-xl border px-4"
                style={{
                  borderColor: colors.input.border,
                  backgroundColor: colors.input.background
                }}
              >
                <Shield
                  size={20}
                  color={colors.textSecondary}
                  className="mr-3"
                />
                <TextInput
                  className="h-full flex-1 text-base"
                  style={{ color: colors.text }}
                  value={code}
                  placeholder="Enter verification code"
                  placeholderTextColor={colors.input.placeholder}
                  keyboardType="number-pad"
                  onChangeText={setCode}
                />
              </View>
            </View>

            <Button
              variant="primary"
              onPress={onVerifyPress}
              disabled={!code || isLoading}
              className="mt-2"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="px-4"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 32
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 items-center">
          <View
            className="mb-6 h-20 w-20 items-center justify-center rounded-[40px]"
            style={{ backgroundColor: colors.primary }}
          >
            <UserPlus size={32} color={colors.textInverse} />
          </View>
          <Text
            className="mb-2 text-[28px] font-bold"
            style={{ color: colors.text }}
          >
            Create Account
          </Text>
          <Text
            className="text-center text-base leading-6"
            style={{ color: colors.textSecondary }}
          >
            Sign up to start tracking your expenses
          </Text>
        </View>

        <Card className="mb-6">
          <View className="mb-5">
            <Text
              className="mb-2 text-base font-semibold"
              style={{ color: colors.text }}
            >
              Email Address
            </Text>
            <View
              className="h-14 flex-row items-center rounded-xl border px-4"
              style={{
                borderColor: colors.input.border,
                backgroundColor: colors.input.background
              }}
            >
              <Mail size={20} color={colors.textSecondary} className="mr-3" />
              <TextInput
                className="h-full flex-1 text-base"
                style={{ color: colors.text }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={emailAddress}
                placeholder="Enter your email"
                placeholderTextColor={colors.input.placeholder}
                onChangeText={setEmailAddress}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text
              className="mb-2 text-base font-semibold"
              style={{ color: colors.text }}
            >
              Password
            </Text>
            <View
              className="h-14 flex-row items-center rounded-xl border px-4"
              style={{
                borderColor: colors.input.border,
                backgroundColor: colors.input.background
              }}
            >
              <Lock size={20} color={colors.textSecondary} className="mr-3" />
              <TextInput
                className="h-full flex-1 text-base"
                style={{ color: colors.text }}
                value={password}
                placeholder="Create a password"
                placeholderTextColor={colors.input.placeholder}
                secureTextEntry={true}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <Button
            variant="primary"
            onPress={onSignUpPress}
            disabled={!emailAddress || !password || isLoading}
            className="mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Card>

        <View className="flex-row items-center justify-center">
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            Already have an account?{' '}
          </Text>
          <Link href="/sign-in" asChild>
            <Button variant="ghost" className="px-2 py-1">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.primary }}
              >
                Sign In
              </Text>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
