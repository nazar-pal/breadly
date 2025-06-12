import React from 'react'
import { Animated } from 'react-native'

export function useAuthAnimations() {
  // Enhanced animation values
  const [fadeAnimation] = React.useState(new Animated.Value(1))
  const [slideAnimation] = React.useState(new Animated.Value(0))
  const [scaleAnimation] = React.useState(new Animated.Value(1))

  // Enhanced step transition animation
  const animateStep = (direction: 'forward' | 'backward') => {
    Animated.parallel([
      // Fade out current content
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      // Slide and scale effect
      Animated.timing(slideAnimation, {
        toValue: direction === 'forward' ? -30 : 30,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      // Reset and fade in new content
      slideAnimation.setValue(direction === 'forward' ? 30 : -30)
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start()
    })
  }

  return {
    fadeAnimation,
    slideAnimation,
    scaleAnimation,
    animateStep
  }
}
