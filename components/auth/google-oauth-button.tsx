import { Button } from '@/components/ui/button'
import { Storage } from '@/lib/storage/mmkv'
import { AUTO_MIGRATE_KEY } from '@/lib/storage/mmkv/keys'
import { isClerkAPIResponseError, useSSO } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Image, Text } from 'react-native'

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

interface GoogleOAuthButtonProps {
  onError?: (error: string) => void
}

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

export function GoogleOAuthButton({ onError }: GoogleOAuthButtonProps) {
  useWarmUpBrowser()

  const { startSSOFlow } = useSSO()

  async function handleSignInWithGoogle() {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp, authSessionResult } =
        await startSSOFlow({
          strategy: 'oauth_google',
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri()
        })

      if (__DEV__) console.log('authSessionResult', authSessionResult)

      // Check if this is a new sign-up by examining the signUp object
      const isNewSignUp =
        signUp?.status === 'complete' &&
        signUp?.createdUserId &&
        !signIn?.createdSessionId

      // If this is a new sign-up, set the migration flag
      if (isNewSignUp) {
        console.log('🆕 New Google sign-up detected, enabling data migration')
        Storage.setItem(AUTO_MIGRATE_KEY, 'true')
      } else {
        console.log('🔑 Existing Google account sign-in')
      }

      /**
       * Handle completed sign-in / sign-up flows
       * --------------------------------------------------
       * Clerk may not always return `createdSessionId` at the top level.
       * For existing users the session id is usually nested inside the
       * `signIn` object. We therefore check both places and, if found,
       * immediately activate the session so that `useAuth()` becomes
       * truthy and the rest of the app can initialize correctly.
       */

      const sessionId =
        createdSessionId || signIn?.createdSessionId || signUp?.createdSessionId

      if (sessionId) {
        if (__DEV__) console.log('✅ Session created, activating…', sessionId)

        await setActive!({ session: sessionId })
        return
      }

      // If there is still no session, we are missing additional steps
      // (e.g. MFA, email verification, account linking, etc.).
      // Surface that information so it is clear why the sign-in halted.
      if (__DEV__) {
        console.log('⚠️ No session yet, inspecting Clerk response…')
        console.log('signIn', JSON.stringify(signIn, null, 2))
        console.log('signUp', JSON.stringify(signUp, null, 2))
      }

      onError?.(
        'Sign-in requires additional steps. Please complete the verification prompts and try again.'
      )
    } catch (err) {
      console.error('Google OAuth error:', JSON.stringify(err, null, 2))

      // Handle Clerk API errors
      if (isClerkAPIResponseError(err)) {
        const errorMessage = err.errors.map(error => error.message).join(', ')
        onError?.(errorMessage)
      } else {
        // Handle other types of errors
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to sign in with Google. Please try again.'
        onError?.(errorMessage)
      }
    }
  }

  return (
    <Button
      variant="outline"
      onPress={handleSignInWithGoogle}
      className="mb-4 flex-row items-center gap-3 rounded-lg border-border/60 bg-card py-4 shadow-sm active:scale-[0.98] active:bg-accent"
    >
      <Image
        source={require('@/assets/images/google-icon.png')}
        className="size-5"
        resizeMode="contain"
      />
      <Text className="text-base text-foreground">Continue with Google</Text>
    </Button>
  )
}
