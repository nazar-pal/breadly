import { cn } from '@/lib/utils'
import React from 'react'
import { Animated, View } from 'react-native'

interface AuthStepIndicatorProps {
  currentStep: 'email' | 'signin' | 'signup' | 'verification'
  scaleAnimation: Animated.Value
}

export function AuthStepIndicator({
  currentStep,
  scaleAnimation
}: AuthStepIndicatorProps) {
  const steps = currentStep === 'verification' ? 3 : 2
  const currentStepNumber =
    currentStep === 'email'
      ? 1
      : currentStep === 'signin' || currentStep === 'signup'
        ? 2
        : 3

  if (currentStep === 'email') {
    return null
  }

  return (
    <View className="mb-6 flex-row items-center justify-center gap-2">
      {Array.from({ length: steps }).map((_, index) => (
        <Animated.View
          key={index}
          className={cn(
            'h-2 rounded-full transition-colors',
            index < currentStepNumber ? 'w-8 bg-primary' : 'w-2 bg-muted'
          )}
          style={{
            transform: [{ scale: scaleAnimation }]
          }}
        />
      ))}
    </View>
  )
}
