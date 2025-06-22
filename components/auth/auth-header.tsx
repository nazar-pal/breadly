import { Text } from '@/components/ui/text'
import { Check, Heart } from '@/lib/icons'
import React from 'react'
import { Animated, View } from 'react-native'

interface AuthHeaderProps {
  step: 'email' | 'signin' | 'signup' | 'verification'
  userEmail?: string
  fadeAnimation: Animated.Value
  scaleAnimation: Animated.Value
}

export function AuthHeader({
  step,
  userEmail,
  fadeAnimation,
  scaleAnimation
}: AuthHeaderProps) {
  const getHeaderContent = () => {
    switch (step) {
      case 'email':
        return {
          title: 'Welcome to Breadly',
          subtitle:
            'Your smart expense tracker.\nEnter your email to get started.'
        }
      case 'signin':
        return {
          title: 'Welcome back!',
          subtitle: 'Great to see you again.\nEnter your password to continue.'
        }
      case 'signup':
        return {
          title: "Let's get started",
          subtitle:
            'Create your account to start\ntracking expenses like a pro.'
        }
      case 'verification':
        return {
          title: 'Check your email',
          subtitle: `We sent a 6-digit code to\n${userEmail}`
        }
    }
  }

  const headerContent = getHeaderContent()

  return (
    <View
      className={step === 'email' ? 'mb-16 items-center' : 'mb-12 items-center'}
    >
      <Animated.View
        className="mb-8 h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 shadow-2xl"
        style={{
          transform: [{ scale: scaleAnimation }]
        }}
      >
        {step === 'verification' ? (
          <Check size={44} className="text-primary-foreground" />
        ) : (
          <Heart size={44} className="text-primary-foreground" />
        )}
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnimation }}>
        <Text className="mb-4 text-center text-4xl font-bold text-foreground">
          {headerContent.title}
        </Text>
        <Text className="max-w-sm text-center text-lg leading-6 text-muted-foreground">
          {headerContent.subtitle}
        </Text>
      </Animated.View>
    </View>
  )
}
