import { AuthBackButton } from '@/components/auth/AuthBackButton'
import { AuthInput } from '@/components/auth/AuthInput'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Lock } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Animated, View } from 'react-native'
import * as z from 'zod'

const passwordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
})

const signUpPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
})

type PasswordFormData = z.infer<typeof passwordSchema>
type SignUpPasswordFormData = z.infer<typeof signUpPasswordSchema>

interface PasswordStepProps {
  isExistingUser: boolean
  userEmail: string
  signInError: string | null
  onSubmit: (password: string) => void
  onBack: () => void
  onForgotPassword: () => void
  fadeAnimation: Animated.Value
}

export function PasswordStep({
  isExistingUser,
  userEmail,
  signInError,
  onSubmit,
  onBack,
  onForgotPassword,
  fadeAnimation
}: PasswordStepProps) {
  const signInForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' }
  })

  const signUpForm = useForm<SignUpPasswordFormData>({
    resolver: zodResolver(signUpPasswordSchema),
    defaultValues: { password: '' }
  })

  const currentForm = isExistingUser ? signInForm : signUpForm

  const handleSubmit = (data: PasswordFormData | SignUpPasswordFormData) => {
    onSubmit(data.password)
  }

  return (
    <Animated.View className="space-y-8" style={{ opacity: fadeAnimation }}>
      <AuthBackButton onPress={onBack} text={userEmail} />

      <AuthInput
        control={currentForm.control}
        name="password"
        label={isExistingUser ? 'Password' : 'Create Password'}
        icon={Lock}
        placeholder={
          isExistingUser ? 'Enter your password' : 'Create a strong password'
        }
        secureTextEntry
        error={
          currentForm.formState.errors.password?.message ||
          (isExistingUser ? signInError || undefined : undefined)
        }
      />

      {!isExistingUser && (
        <View className="rounded-2xl bg-gradient-to-r from-muted/30 to-muted/50 p-6">
          <Text className="text-center text-sm leading-5 text-muted-foreground">
            💪 Password must be at least 8 characters{'\n'}
            🔤 Include uppercase & lowercase letters{'\n'}
            🔢 Include at least one number
          </Text>
        </View>
      )}

      <Button
        variant="default"
        onPress={currentForm.handleSubmit(handleSubmit)}
        disabled={currentForm.formState.isSubmitting}
        className={cn(
          'h-16 w-full rounded-2xl bg-gradient-to-r from-primary to-primary/90 shadow-xl',
          currentForm.formState.isSubmitting && 'opacity-70'
        )}
      >
        <Text className="text-lg font-bold text-primary-foreground">
          {currentForm.formState.isSubmitting
            ? isExistingUser
              ? '🔄 Signing in...'
              : '🔄 Creating account...'
            : isExistingUser
              ? '🚀 Sign In'
              : '✨ Create Account'}
        </Text>
      </Button>

      {isExistingUser && (
        <Button
          variant="ghost"
          onPress={onForgotPassword}
          className="mt-6 h-12"
        >
          <Text className="text-base font-medium text-primary">
            Forgot password?
          </Text>
        </Button>
      )}
    </Animated.View>
  )
}
