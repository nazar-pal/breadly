import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Lock, Mail, Shield, UserPlus } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useSignUp } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import * as React from 'react'
import { Alert, View } from 'react-native'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()

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
        // The auth layout will handle the redirect to home
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
      <AuthLayout>
        <AuthCard
          icon={<Shield size={32} className="text-primary-foreground" />}
          title="Verify Your Email"
          subtitle={`We sent a verification code to ${emailAddress}`}
        >
          <AuthInput
            label="Verification Code"
            icon={Shield}
            value={code}
            onChangeText={setCode}
            placeholder="Enter verification code"
            keyboardType="number-pad"
          />

          <Button
            variant="default"
            onPress={onVerifyPress}
            disabled={!code || isLoading}
            className={cn(
              'mt-2 h-14 w-full rounded-xl',
              isLoading && 'opacity-50'
            )}
          >
            <Text className="text-base font-semibold">
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Text>
          </Button>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthCard
        icon={<UserPlus size={32} className="text-primary-foreground" />}
        title="Create Account"
        subtitle="Sign up to start tracking your expenses"
      >
        <AuthInput
          label="Email Address"
          icon={Mail}
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <AuthInput
          label="Password"
          icon={Lock}
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
        />

        <Button
          variant="default"
          onPress={onSignUpPress}
          disabled={!emailAddress || !password || isLoading}
          className={cn(
            'mt-2 h-14 w-full rounded-xl',
            isLoading && 'opacity-50'
          )}
        >
          <Text className="text-base font-semibold">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </Button>
      </AuthCard>

      <View className="mt-6 flex-row items-center justify-center">
        <Text className="text-base text-muted-foreground">
          Already have an account?{' '}
        </Text>
        <Link href="/sign-in" asChild>
          <Button variant="ghost" className="px-2 py-1">
            <Text className="text-base font-semibold text-primary">
              Sign In
            </Text>
          </Button>
        </Link>
      </View>
    </AuthLayout>
  )
}
