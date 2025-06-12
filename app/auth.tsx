import React from 'react'
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  AuthHeader,
  AuthStepIndicator,
  EmailStep,
  PasswordStep,
  VerificationStep
} from '@/components/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Text } from '@/components/ui/text'
import { useAuthFlow } from '@/hooks'
import { cn } from '@/lib/utils'

const { height: screenHeight } = Dimensions.get('window')

export default function AuthRoutesLayout() {
  const insets = useSafeAreaInsets()
  const {
    // State
    isLoaded,
    step,
    userEmail,
    isExistingUser,
    signInError,
    errorDialog,
    setErrorDialog,

    // Animations
    fadeAnimation,
    slideAnimation,
    scaleAnimation,

    // Actions
    onEmailSubmit,
    onPasswordSubmit,
    onVerificationSubmit,
    handleResendCode,
    resetToEmail,
    goBackStep,
    handleForgotPassword
  } = useAuthFlow()

  if (!isLoaded) return null

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <SafeAreaView className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: screenHeight - 100
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              className="flex-1 justify-center px-6 py-8"
              style={{
                opacity: fadeAnimation,
                transform: [
                  { translateX: slideAnimation },
                  { scale: scaleAnimation }
                ]
              }}
            >
              {/* Step Indicator */}
              <AuthStepIndicator
                currentStep={step}
                scaleAnimation={scaleAnimation}
              />

              {/* Header */}
              <AuthHeader
                step={step}
                userEmail={userEmail}
                fadeAnimation={fadeAnimation}
                scaleAnimation={scaleAnimation}
              />

              {/* Form Content */}
              <View className="mx-auto w-full max-w-sm flex-1">
                {/* Email Step */}
                {step === 'email' && (
                  <EmailStep
                    onSubmit={onEmailSubmit}
                    fadeAnimation={fadeAnimation}
                  />
                )}

                {/* Password Step (Sign In or Sign Up) */}
                {(step === 'signin' || step === 'signup') && (
                  <PasswordStep
                    isExistingUser={isExistingUser}
                    userEmail={userEmail}
                    signInError={signInError}
                    onSubmit={onPasswordSubmit}
                    onBack={goBackStep}
                    onForgotPassword={handleForgotPassword}
                    fadeAnimation={fadeAnimation}
                  />
                )}

                {/* Verification Step */}
                {step === 'verification' && (
                  <VerificationStep
                    onSubmit={onVerificationSubmit}
                    onResendCode={handleResendCode}
                    onChangeEmail={resetToEmail}
                    onBack={goBackStep}
                    fadeAnimation={fadeAnimation}
                  />
                )}
              </View>

              {/* Footer */}
              <Animated.View
                className="mt-12 items-center"
                style={{ opacity: fadeAnimation }}
              >
                <Text className="max-w-xs text-center text-xs leading-4 text-muted-foreground">
                  By continuing, you agree to our{'\n'}
                  <Text className="text-primary">
                    Terms of Service
                  </Text> and{' '}
                  <Text className="text-primary">Privacy Policy</Text>
                </Text>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Custom Error Dialog */}
        <AlertDialog
          open={errorDialog.isOpen}
          onOpenChange={open =>
            setErrorDialog(prev => ({ ...prev, isOpen: open }))
          }
        >
          <AlertDialogContent className="mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle
                className={cn(
                  errorDialog.type === 'error'
                    ? 'text-destructive'
                    : errorDialog.type === 'success'
                      ? 'text-green-600'
                      : 'text-foreground'
                )}
              >
                {errorDialog.title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {errorDialog.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onPress={() =>
                  setErrorDialog(prev => ({ ...prev, isOpen: false }))
                }
                className={cn(
                  errorDialog.type === 'error'
                    ? 'bg-destructive'
                    : errorDialog.type === 'success'
                      ? 'bg-green-600'
                      : 'bg-primary'
                )}
              >
                <Text className="font-semibold text-primary-foreground">
                  {errorDialog.type === 'success' ? 'Great!' : 'OK'}
                </Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SafeAreaView>
    </View>
  )
}
