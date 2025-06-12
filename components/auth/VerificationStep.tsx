import { AuthBackButton } from '@/components/auth/AuthBackButton'
import { AuthInput } from '@/components/auth/AuthInput'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Shield } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Animated, View } from 'react-native'
import * as z from 'zod'

const verificationSchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be 6 digits')
})

type VerificationFormData = z.infer<typeof verificationSchema>

interface VerificationStepProps {
  onSubmit: (code: string) => void
  onResendCode: () => void
  onChangeEmail: () => void
  onBack: () => void
  fadeAnimation: Animated.Value
}

export function VerificationStep({
  onSubmit,
  onResendCode,
  onChangeEmail,
  onBack,
  fadeAnimation
}: VerificationStepProps) {
  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: '' }
  })

  const handleSubmit = (data: VerificationFormData) => {
    onSubmit(data.code)
  }

  return (
    <Animated.View className="space-y-8" style={{ opacity: fadeAnimation }}>
      <AuthBackButton onPress={onBack} text="Back to password" />

      <AuthInput
        control={form.control}
        name="code"
        label="Verification Code"
        icon={Shield}
        placeholder="000000"
        keyboardType="number-pad"
        autoCapitalize="none"
        autoCorrect={false}
        error={form.formState.errors.code?.message}
      />

      <Button
        variant="default"
        onPress={form.handleSubmit(handleSubmit)}
        disabled={form.formState.isSubmitting}
        className={cn(
          'h-16 w-full rounded-2xl bg-gradient-to-r from-primary to-primary/90 shadow-xl',
          form.formState.isSubmitting && 'opacity-70'
        )}
      >
        <Text className="text-lg font-bold text-primary-foreground">
          {form.formState.isSubmitting ? '🔄 Verifying...' : '🎉 Verify Email'}
        </Text>
      </Button>

      <View className="space-y-3">
        <Button variant="ghost" onPress={onResendCode} className="h-12">
          <Text className="text-base font-medium text-primary">
            📧 Resend code
          </Text>
        </Button>

        <Button variant="ghost" onPress={onChangeEmail} className="h-10">
          <Text className="text-sm text-muted-foreground">
            Wrong email? Change it
          </Text>
        </Button>
      </View>
    </Animated.View>
  )
}
