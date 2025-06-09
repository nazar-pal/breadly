import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Lock, LogIn, Mail } from '@/lib/icons'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const insets = useSafeAreaInsets()

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
        router.replace('/')
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
    <KeyboardAvoidingView
      className="flex-1 bg-background"
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
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full">
            <LogIn size={32} color="#FFFFFF" />
          </View>
          <Text className="mb-2 text-[28px] font-bold text-foreground">
            Welcome Back
          </Text>
          <Text className="text-center text-base leading-6 text-foreground">
            Sign in to your account to continue
          </Text>
        </View>

        <Card>
          <CardContent>
            <View className="mb-5">
              <Text className="mb-2 text-base font-semibold text-foreground">
                Email Address
              </Text>
              <View className="flex-row items-center gap-3">
                <View className="h-14 w-14 items-center justify-center rounded-xl">
                  <Mail size={20} color="#4A5568" />
                </View>
                <View className="flex-1">
                  <Input
                    className="h-14 text-foreground"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderClassName="text-[#A0ADB8]"
                    onChangeText={setEmailAddress}
                  />
                </View>
              </View>
            </View>

            <View className="mb-5">
              <Text className="mb-2 text-base font-semibold text-foreground">
                Password
              </Text>
              <View className="flex-row items-center gap-3">
                <View className="h-14 w-14 items-center justify-center rounded-xl">
                  <Lock size={20} color="#4A5568" />
                </View>
                <View className="flex-1">
                  <Input
                    className="h-14 text-foreground"
                    value={password}
                    placeholder="Enter your password"
                    placeholderClassName="text-[#A0ADB8]"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                  />
                </View>
              </View>
            </View>

            <Button
              variant="default"
              onPress={onSignInPress}
              disabled={!emailAddress || !password || isLoading}
              className="mt-2 w-full"
            >
              <Text>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
            </Button>
          </CardContent>
        </Card>

        <View className="flex-row items-center justify-center">
          <Text className="text-base text-foreground">
            Don&apos;t have an account?{' '}
          </Text>
          <Link href="/sign-up" asChild>
            <Button variant="ghost" className="px-2 py-1">
              <Text className="text-base font-semibold">Sign Up</Text>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
