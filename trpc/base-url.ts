import { env } from '@/env'
import Constants from 'expo-constants'

/**
 * Gets the base URL for the API based on the environment.
 * - In development: Automatically detects the host IP from Expo
 * - In production: Uses the production API URL from environment variables
 */
export const getBaseUrl = () => {
  if (__DEV__) {
    /**
     * Development: Gets the IP address of your host-machine from Expo Constants.
     * This automatically handles the localhost vs actual IP issue for mobile devices.
     */
    const debuggerHost = Constants.expoConfig?.hostUri
    const localhost = debuggerHost?.split(':')[0]

    if (!localhost) {
      throw new Error(
        'Failed to get localhost. Make sure your Expo development server is running.'
      )
    }

    const url = `http://${localhost}:8081`
    console.log('[getBaseUrl] Development mode:', url)
    return url
  } else {
    /**
     * Production: Uses the production API URL from environment variables
     * Only allows HTTPS for security. HTTP is prohibited in production.
     */
    const apiUrl = env.EXPO_PUBLIC_API_URL

    // Security check: reject HTTP URLs in production
    if (apiUrl.startsWith('http://')) {
      throw new Error(
        'HTTP URLs are not allowed in production for security reasons. Please use HTTPS.'
      )
    }

    const url = apiUrl.startsWith('https://') ? apiUrl : `https://${apiUrl}`

    console.log('[getBaseUrl] Production mode:', url)
    return url
  }
}
