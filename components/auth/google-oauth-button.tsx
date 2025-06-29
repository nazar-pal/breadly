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

export function GoogleOAuthButton({ onError }: GoogleOAuthButtonProps) {
  const { startSSOFlow } = useSSO()

  async function handleSignInWithGoogle() {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: 'oauth_google',
          // Defaults to current path
          redirectUrl: AuthSession.makeRedirectUri()
        })

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

      // If sign in was successful, set the active session
      if (createdSessionId) {
        await setActive!({ session: createdSessionId })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
        console.log(
          'OAuth flow completed, but no session created - may require additional steps'
        )
      }
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
