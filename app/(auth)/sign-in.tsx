import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Lock, LogIn, Mail } from 'lucide-react-native'
import React from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { colors, spacing } = useTheme()
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
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: spacing.md
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[styles.iconContainer, { backgroundColor: colors.primary }]}
          >
            <LogIn size={32} color={colors.textInverse} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to your account to continue
          </Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Email Address
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: colors.input.border,
                  backgroundColor: colors.input.background
                }
              ]}
            >
              <Mail
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
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

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: colors.input.border,
                  backgroundColor: colors.input.background
                }
              ]}
            >
              <Lock
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={password}
                placeholder="Enter your password"
                placeholderTextColor={colors.input.placeholder}
                secureTextEntry={true}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <Button
            variant="primary"
            onPress={onSignInPress}
            disabled={!emailAddress || !password || isLoading}
            style={styles.signInButton}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don&apos;t have an account?{' '}
          </Text>
          <Link href="/sign-up" asChild>
            <Button variant="ghost" style={styles.linkButton}>
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Sign Up
              </Text>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 32
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24
  },
  formCard: {
    marginBottom: 24
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56
  },
  inputIcon: {
    marginRight: 12
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%'
  },
  signInButton: {
    marginTop: 8
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
    fontSize: 16
  },
  linkButton: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600'
  }
})
