import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
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
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const { colors, spacing } = useTheme()
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
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primary }
              ]}
            >
              <Shield size={32} color={colors.textInverse} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Verify Your Email
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              We sent a verification code to {emailAddress}
            </Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Verification Code
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
                <Shield
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
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
              style={styles.verifyButton}
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
            <UserPlus size={32} color={colors.textInverse} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign up to start tracking your expenses
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
            style={styles.signUpButton}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <Link href="/sign-in" asChild>
            <Button variant="ghost" style={styles.linkButton}>
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Sign In
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
  signUpButton: {
    marginTop: 8
  },
  verifyButton: {
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
