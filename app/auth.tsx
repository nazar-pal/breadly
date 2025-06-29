import React from 'react'
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  AuthHeader,
  AuthStepIndicator,
  EmailStep,
  PasswordStep,
  VerificationStep
} from '@/components/auth'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useUserSession } from '@/lib/context/user-context'
import { useAuthFlow, useMigrationPreview } from '@/lib/hooks'

const { height: screenHeight } = Dimensions.get('window')

export default function AuthRoutesLayout() {
  const userSession = useUserSession()
  const { stats } = useMigrationPreview()
  const [modalState, setModalState] = React.useState<{
    termsVisible: boolean
    privacyVisible: boolean
  }>({
    termsVisible: false,
    privacyVisible: false
  })
  const {
    // State
    step,
    userEmail,
    isExistingUser,
    signInError,

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

  return (
    <View className="flex-1 bg-background">
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
                  <>
                    <PasswordStep
                      isExistingUser={isExistingUser}
                      userEmail={userEmail}
                      signInError={signInError}
                      onSubmit={onPasswordSubmit}
                      onBack={goBackStep}
                      onForgotPassword={handleForgotPassword}
                      fadeAnimation={fadeAnimation}
                    />

                    {/* Show migration preview for guest users signing up */}
                    {!isExistingUser &&
                      userSession.isGuest &&
                      stats &&
                      stats.total > 0 && (
                        <View className="mt-6 rounded-lg bg-primary/5 p-4">
                          <Text className="mb-2 font-semibold text-foreground">
                            Your data will be preserved! 🎉
                          </Text>
                          <Text className="mb-3 text-sm text-muted-foreground">
                            You have {stats.total} items that will be saved to
                            your account:
                          </Text>

                          <View className="space-y-1">
                            {stats.transactions > 0 && (
                              <Text className="text-sm text-muted-foreground">
                                • {stats.transactions} transactions
                              </Text>
                            )}
                            {stats.accounts > 0 && (
                              <Text className="text-sm text-muted-foreground">
                                • {stats.accounts} accounts
                              </Text>
                            )}
                            {stats.categories > 0 && (
                              <Text className="text-sm text-muted-foreground">
                                • {stats.categories} categories
                              </Text>
                            )}
                            {stats.budgets > 0 && (
                              <Text className="text-sm text-muted-foreground">
                                • {stats.budgets} budgets
                              </Text>
                            )}
                          </View>

                          <Text className="mt-3 text-xs text-muted-foreground">
                            All your data will be automatically synced to the
                            cloud after creating your account.
                          </Text>
                        </View>
                      )}
                  </>
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
                  <Pressable
                    onPress={() =>
                      setModalState(prev => ({ ...prev, termsVisible: true }))
                    }
                  >
                    <Text className="text-primary underline">
                      Terms of Service
                    </Text>
                  </Pressable>{' '}
                  and{' '}
                  <Pressable
                    onPress={() =>
                      setModalState(prev => ({ ...prev, privacyVisible: true }))
                    }
                  >
                    <Text className="text-primary underline">
                      Privacy Policy
                    </Text>
                  </Pressable>
                </Text>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Terms of Service Modal */}
        <View>
          <Modal
            visible={modalState.termsVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() =>
              setModalState(prev => ({ ...prev, termsVisible: false }))
            }
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="mx-4 mb-8 h-[60vh] rounded-2xl bg-background shadow-2xl">
                <SafeAreaView>
                  <View className="px-6 py-6">
                    <View className="mb-6 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text className="mr-2 text-2xl">📄</Text>
                        <Text className="text-2xl font-bold text-foreground">
                          Terms of Service
                        </Text>
                      </View>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                        onPress={() =>
                          setModalState(prev => ({
                            ...prev,
                            termsVisible: false
                          }))
                        }
                      >
                        <Text className="text-primary">Done</Text>
                      </Button>
                    </View>

                    <ScrollView
                      className="max-h-[60vh]"
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 20 }}
                    >
                      <View className="space-y-6">
                        <View className="rounded-xl border border-border bg-muted/30 p-6">
                          <View className="mb-4 items-center">
                            <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Text className="text-2xl">📋</Text>
                            </View>
                            <Text className="text-center text-lg font-semibold text-foreground">
                              Terms of Service
                            </Text>
                          </View>
                          <Text className="text-center text-sm text-muted-foreground">
                            We&apos;re currently working on our comprehensive
                            Terms of Service document.
                          </Text>
                          <Text className="mt-3 text-center text-xs text-muted-foreground">
                            This document will include our user agreements,
                            service conditions, and usage policies. Please check
                            back soon for the complete terms.
                          </Text>
                        </View>

                        <View>
                          <Text className="mb-4 text-base font-medium text-foreground">
                            Current Service Agreement
                          </Text>
                          <Text className="mb-4 text-sm text-muted-foreground">
                            In the meantime, by using our service, you
                            acknowledge that:
                          </Text>

                          <View className="space-y-3">
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                Our service is provided as-is while in
                                development
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                We are committed to user privacy and data
                                protection
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                Complete terms will be available before our
                                official launch
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                You may discontinue use at any time
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </SafeAreaView>
              </View>
            </View>
          </Modal>
        </View>

        {/* Privacy Policy Modal */}
        <View>
          <Modal
            visible={modalState.privacyVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() =>
              setModalState(prev => ({ ...prev, privacyVisible: false }))
            }
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="mx-4 mb-8 h-[60vh] rounded-2xl bg-background shadow-2xl">
                <SafeAreaView>
                  <View className="px-6 py-6">
                    <View className="mb-6 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text className="mr-2 text-2xl">🔒</Text>
                        <Text className="text-2xl font-bold text-foreground">
                          Privacy Policy
                        </Text>
                      </View>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                        onPress={() =>
                          setModalState(prev => ({
                            ...prev,
                            privacyVisible: false
                          }))
                        }
                      >
                        <Text className="text-primary">Done</Text>
                      </Button>
                    </View>

                    <ScrollView
                      className="max-h-[60vh]"
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 20 }}
                    >
                      <View className="space-y-6">
                        <View className="rounded-xl border border-border bg-muted/30 p-6">
                          <View className="mb-4 items-center">
                            <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Text className="text-2xl">🛡️</Text>
                            </View>
                            <Text className="text-center text-lg font-semibold text-foreground">
                              Privacy Policy
                            </Text>
                          </View>
                          <Text className="text-center text-sm text-muted-foreground">
                            We&apos;re currently preparing our detailed Privacy
                            Policy.
                          </Text>
                          <Text className="mt-3 text-center text-xs text-muted-foreground">
                            This document will outline how we collect, use, and
                            protect your personal information. Your privacy is
                            important to us, and we&apos;re ensuring our policy
                            is comprehensive and transparent.
                          </Text>
                        </View>

                        <View>
                          <Text className="mb-4 text-base font-medium text-foreground">
                            Our Privacy Commitment
                          </Text>
                          <Text className="mb-4 text-sm text-muted-foreground">
                            Our commitment to your privacy includes:
                          </Text>

                          <View className="space-y-3">
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                Minimal data collection practices
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                Secure storage and transmission of your
                                information
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                No selling or sharing of personal data with
                                third parties
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                Full transparency about data usage
                              </Text>
                            </View>
                            <View className="flex-row items-start">
                              <View className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary" />
                              <Text className="flex-1 text-sm text-foreground">
                                Your right to access, modify, or delete your
                                data
                              </Text>
                            </View>
                          </View>

                          <Text className="mt-6 text-xs text-muted-foreground">
                            Complete privacy policy will be available soon. If
                            you have any privacy concerns, please feel free to
                            contact us.
                          </Text>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </SafeAreaView>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  )
}
