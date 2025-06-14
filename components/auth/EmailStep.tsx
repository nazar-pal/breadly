import { AuthInput } from '@/components/auth/AuthInput'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { ArrowRight, Mail } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Animated, View } from 'react-native'
import * as z from 'zod/v4'

const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
})

type EmailFormData = z.infer<typeof emailSchema>

interface EmailStepProps {
  onSubmit: (email: string) => void
  fadeAnimation: Animated.Value
}

export function EmailStep({ onSubmit, fadeAnimation }: EmailStepProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' }
  })

  const handleSubmit = (data: EmailFormData) => {
    onSubmit(data.email)
  }

  return (
    <Animated.View className="space-y-8" style={{ opacity: fadeAnimation }}>
      <AuthInput
        control={form.control}
        name="email"
        label="Email Address"
        icon={Mail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={form.formState.errors.email?.message}
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
        <View className="flex-row items-center gap-3">
          <Text className="text-lg font-bold text-primary-foreground">
            {form.formState.isSubmitting ? 'Checking...' : 'Continue'}
          </Text>
          {!form.formState.isSubmitting && (
            <ArrowRight size={22} className="text-primary-foreground" />
          )}
        </View>
      </Button>
    </Animated.View>
  )
}
