import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Lock, LogIn, Mail } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useSignIn } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import React from 'react'
import { Alert, View } from 'react-native'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        // The auth layout will handle the redirect to home
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        Alert.alert('Error', 'Something went wrong. Please try again.')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Alert.alert(
        'Error',
        err.errors?.[0]?.message || 'Failed to sign in. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        icon={<LogIn size={32} className="text-primary-foreground" />}
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
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
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button
          variant="default"
          onPress={onSignInPress}
          disabled={!emailAddress || !password || isLoading}
          className={cn(
            'mt-2 h-14 w-full rounded-xl',
            isLoading && 'opacity-50'
          )}
        >
          <Text className="text-base font-semibold">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </Button>
      </AuthCard>

      <View className="mt-6 flex-row items-center justify-center">
        <Text className="text-base text-muted-foreground">
          Don&apos;t have an account?{' '}
        </Text>
        <Link href="/sign-up" asChild>
          <Button variant="ghost" className="px-2 py-1">
            <Text className="text-base font-semibold text-primary">
              Sign Up
            </Text>
          </Button>
        </Link>
      </View>
    </AuthLayout>
  )
}
