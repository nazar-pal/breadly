import { Storage } from '@/lib/storage'
import { useAuth, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import React from 'react'
import { AUTO_MIGRATE_KEY } from '../context/user-context'
import { useAuthAnimations } from './useAuthAnimations'

export type AuthStep = 'email' | 'signin' | 'signup' | 'verification'

interface ErrorDialogState {
  isOpen: boolean
  title: string
  message: string
  type?: 'error' | 'success' | 'info'
}

export function useAuthFlow() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const { fadeAnimation, slideAnimation, scaleAnimation, animateStep } =
    useAuthAnimations()

  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: signInLoaded
  } = useSignIn()

  const {
    signUp,
    setActive: setSignUpActive,
    isLoaded: signUpLoaded
  } = useSignUp()

  const [step, setStep] = React.useState<AuthStep>('email')
  const [userEmail, setUserEmail] = React.useState('')
  const [isExistingUser, setIsExistingUser] = React.useState(false)
  const [signInError, setSignInError] = React.useState<string | null>(null)

  // Error dialog state
  const [errorDialog, setErrorDialog] = React.useState<ErrorDialogState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  })

  React.useEffect(() => {
    if (isSignedIn) {
      router.replace('/(tabs)')
    }
  }, [isSignedIn, router])

  // Show error dialog helper
  const showErrorDialog = (
    title: string,
    message: string,
    type: 'error' | 'success' | 'info' = 'error'
  ) => {
    setErrorDialog({
      isOpen: true,
      title,
      message,
      type
    })
  }

  const onEmailSubmit = async (email: string) => {
    if (!signInLoaded || !signUpLoaded) return

    try {
      // Try to create a sign-in attempt to check if email exists
      await signIn.create({ identifier: email })

      // If we get here, email exists - proceed to sign-in
      setUserEmail(email)
      setIsExistingUser(true)
      setStep('signin')
      animateStep('forward')
    } catch (err: any) {
      // Email doesn't exist - proceed to sign-up
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        console.log(`📧 Email ${email} not found - proceeding to sign-up flow`)
        setUserEmail(email)
        setIsExistingUser(false)
        setStep('signup')
        animateStep('forward')
      } else {
        // Log unexpected errors only
        console.error(
          'Unexpected email check error:',
          JSON.stringify(err, null, 2)
        )
        // Handle other types of errors
        let errorMessage = 'Please check your email and try again.'

        if (err.errors && err.errors.length > 0) {
          const error = err.errors[0]

          switch (error.code) {
            case 'form_param_format_invalid':
              errorMessage = 'Please enter a valid email address.'
              break
            case 'too_many_requests':
              errorMessage =
                'Too many attempts. Please wait a moment and try again.'
              break
            default:
              errorMessage = error.message || errorMessage
          }
        }

        showErrorDialog('Email Error', errorMessage)
      }
    }
  }

  const onSignInSubmit = async (password: string) => {
    if (!signInLoaded) return

    // Clear any previous errors
    setSignInError(null)

    try {
      const signInAttempt = await signIn.create({
        identifier: userEmail,
        password: password
      })

      if (signInAttempt.status === 'complete') {
        await setSignInActive({ session: signInAttempt.createdSessionId })
      } else {
        // Handle incomplete sign-in attempts
        console.error(
          'Sign-in incomplete:',
          JSON.stringify(signInAttempt, null, 2)
        )

        let errorMessage = 'Unable to complete sign in. Please try again.'

        // Check for specific status errors
        if (signInAttempt.status === 'needs_first_factor') {
          errorMessage = 'Incorrect password. Please try again.'
        } else if (signInAttempt.status === 'needs_second_factor') {
          errorMessage =
            'Two-factor authentication required. Please check your authenticator app.'
        } else if (signInAttempt.status === 'needs_new_password') {
          errorMessage =
            'You need to reset your password. Please contact support.'
        }

        setSignInError(errorMessage)
        showErrorDialog('Sign In Failed', errorMessage)
      }
    } catch (err: any) {
      console.error('Sign-in error:', JSON.stringify(err, null, 2))

      // Handle different types of authentication errors
      let errorMessage = 'Please check your credentials and try again.'

      if (err.errors && err.errors.length > 0) {
        const error = err.errors[0]

        switch (error.code) {
          case 'form_password_incorrect':
          case 'form_password_invalid':
          case 'session_invalid':
            errorMessage = 'Incorrect password. Please try again.'
            break
          case 'form_identifier_not_found':
            errorMessage = 'Account not found. Please check your email.'
            break
          case 'too_many_requests':
            errorMessage =
              'Too many attempts. Please wait a moment and try again.'
            break
          case 'form_password_pwned':
            errorMessage =
              'This password has been compromised. Please use a different password.'
            break
          case 'form_password_size_in_bytes_exceeded':
            errorMessage =
              'Password is too long. Please use a shorter password.'
            break
          default:
            errorMessage = error.message || error.longMessage || errorMessage
        }
      } else if (err.message) {
        // Handle cases where there might be a direct error message
        errorMessage = err.message
      }

      // Set error state and show dialog
      setSignInError(errorMessage)
      showErrorDialog('Sign In Failed', errorMessage)
    }
  }

  const onSignUpSubmit = async (password: string) => {
    if (!signUpLoaded) return

    try {
      await signUp.create({
        emailAddress: userEmail,
        password: password
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setStep('verification')
      animateStep('forward')

      // Mark that we just finished creating a brand-new account so that the
      // guest data can be migrated automatically on the first authenticated session.

      Storage.setItem(AUTO_MIGRATE_KEY, 'true')
    } catch (err: any) {
      console.error('Sign-up error:', JSON.stringify(err, null, 2))

      let errorMessage = 'Failed to create account. Please try again.'

      if (err.errors && err.errors.length > 0) {
        const error = err.errors[0]

        switch (error.code) {
          case 'form_identifier_exists':
            errorMessage =
              'An account with this email already exists. Please sign in instead.'
            break
          case 'form_password_pwned':
            errorMessage =
              'This password has been found in a data breach. Please choose a different password.'
            break
          case 'form_password_too_common':
            errorMessage =
              'This password is too common. Please choose a more secure password.'
            break
          case 'form_password_length_too_short':
            errorMessage = 'Password must be at least 8 characters long.'
            break
          case 'form_param_format_invalid':
            if (error.meta?.paramName === 'email_address') {
              errorMessage = 'Please enter a valid email address.'
            } else {
              errorMessage = error.message || errorMessage
            }
            break
          default:
            errorMessage = error.message || errorMessage
        }
      }

      showErrorDialog('Sign Up Failed', errorMessage)
    }
  }

  const onVerificationSubmit = async (code: string) => {
    if (!signUpLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code
      })

      if (signUpAttempt.status === 'complete') {
        await setSignUpActive({ session: signUpAttempt.createdSessionId })
      } else {
        console.error(
          'Verification incomplete:',
          JSON.stringify(signUpAttempt, null, 2)
        )
        showErrorDialog(
          'Verification Failed',
          'Unable to complete verification. Please try again.'
        )
      }
    } catch (err: any) {
      console.error('Verification error:', JSON.stringify(err, null, 2))

      let errorMessage = 'Please check your verification code and try again.'

      if (err.errors && err.errors.length > 0) {
        const error = err.errors[0]

        switch (error.code) {
          case 'form_code_incorrect':
            errorMessage =
              'Incorrect verification code. Please check and try again.'
            break
          case 'verification_expired':
            errorMessage =
              'Verification code has expired. Please request a new one.'
            break
          case 'too_many_requests':
            errorMessage =
              'Too many attempts. Please wait a moment and try again.'
            break
          default:
            errorMessage = error.message || errorMessage
        }
      }

      showErrorDialog('Verification Failed', errorMessage)
    }
  }

  const handleResendCode = async () => {
    if (!signUpLoaded) return

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      showErrorDialog(
        'Code Sent',
        'A new verification code has been sent to your email.',
        'success'
      )
    } catch (err: any) {
      console.error('Resend error:', JSON.stringify(err, null, 2))
      showErrorDialog(
        'Resend Failed',
        'Failed to resend code. Please try again.'
      )
    }
  }

  const resetToEmail = () => {
    setStep('email')
    setUserEmail('')
    setIsExistingUser(false)
    setSignInError(null)
    animateStep('backward')
  }

  const goBackStep = () => {
    if (step === 'signin' || step === 'signup') {
      resetToEmail()
    } else if (step === 'verification') {
      setStep('signup')
      setSignInError(null)
      animateStep('backward')
    }
  }

  const handleForgotPassword = () => {
    showErrorDialog(
      'Forgot Password',
      'Password reset functionality is coming soon! 🚧',
      'info'
    )
  }

  const onPasswordSubmit = (password: string) => {
    if (isExistingUser) {
      return onSignInSubmit(password)
    } else {
      return onSignUpSubmit(password)
    }
  }

  return {
    // State
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
    handleForgotPassword,
    showErrorDialog
  }
}
