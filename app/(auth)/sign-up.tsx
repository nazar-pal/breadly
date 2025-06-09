import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Lock, Mail, Shield, UserPlus } from 'lucide-react-native'
import * as React from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
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
        className="flex-1 bg-old-background"
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
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-[40px] bg-old-primary">
              <Shield size={32} color="#FFFFFF" />
            </View>
            <Text className="mb-2 text-[28px] font-bold text-old-text">
              Verify Your Email
            </Text>
            <Text className="text-center text-base leading-6 text-old-text-secondary">
              We sent a verification code to {emailAddress}
            </Text>
          </View>

          <Card>
            <CardContent>
              <View className="mb-5">
                <Text className="mb-2 text-base font-semibold text-old-text">
                  Verification Code
                </Text>
                <View className="h-14 flex-row items-center rounded-xl border border-old-input-border bg-old-input-background px-4">
                  <Shield size={20} color="#4A5568" className="mr-3" />
                  <TextInput
                    className="h-full flex-1 text-base text-old-text"
                    value={code}
                    placeholder="Enter verification code"
                    placeholderTextColor="#A0ADB8"
                    keyboardType="number-pad"
                    onChangeText={setCode}
                  />
                </View>
              </View>

              <Button
                variant="default"
                onPress={onVerifyPress}
                disabled={!code || isLoading}
                className="mt-2 w-full"
              >
                <Text>{isLoading ? 'Verifying...' : 'Verify Email'}</Text>
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-old-background"
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
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-[40px] bg-old-primary">
            <UserPlus size={32} color="#FFFFFF" />
          </View>
          <Text className="mb-2 text-[28px] font-bold text-old-text">
            Create Account
          </Text>
          <Text className="text-center text-base leading-6 text-old-text-secondary">
            Sign up to start tracking your expenses
          </Text>
        </View>

        <Card>
          <CardContent>
            <View className="mb-5">
              <Text className="mb-2 text-base font-semibold text-old-text">
                Email Address
              </Text>
              <View className="h-14 flex-row items-center rounded-xl border border-old-input-border bg-old-input-background px-4">
                <Mail size={20} color="#4A5568" className="mr-3" />
                <TextInput
                  className="h-full flex-1 text-base text-old-text"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#A0ADB8"
                  onChangeText={setEmailAddress}
                />
              </View>
            </View>

            <View className="mb-5">
              <Text className="mb-2 text-base font-semibold text-old-text">
                Password
              </Text>
              <View className="h-14 flex-row items-center rounded-xl border border-old-input-border bg-old-input-background px-4">
                <Lock size={20} color="#4A5568" className="mr-3" />
                <TextInput
                  className="h-full flex-1 text-base text-old-text"
                  value={password}
                  placeholder="Create a password"
                  placeholderTextColor="#A0ADB8"
                  secureTextEntry={true}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <Button
              variant="default"
              onPress={onSignUpPress}
              disabled={!emailAddress || !password || isLoading}
              className="mt-2 w-full"
            >
              <Text>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Button>
          </CardContent>
        </Card>

        <View className="flex-row items-center justify-center">
          <Text className="text-base text-old-text-secondary">
            Already have an account?{' '}
          </Text>
          <Link href="/sign-in" asChild>
            <Button variant="ghost" className="px-2 py-1">
              <Text className="text-base font-semibold text-old-primary">
                Sign In
              </Text>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
