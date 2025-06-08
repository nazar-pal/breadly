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
     * Development: Platform-specific URLs for optimal performance and compatibility
     * - Web: Uses localhost for best performance and reliability
     * - Mobile: Uses actual IP address since localhost refers to the device itself
     */
    const { Platform } = require('react-native')

    if (Platform.OS === 'web') {
      // Web can use localhost for better performance and fewer firewall issues
      const url = 'http://localhost:8081'
      console.log('[getBaseUrl] Development mode (web):', url)
      return url
    } else {
      // Mobile devices need the actual IP address of the development machine
      const debuggerHost = Constants.expoConfig?.hostUri
      const hostIP = debuggerHost?.split(':')[0]

      if (!hostIP) {
        throw new Error(
          'Failed to get host IP from Expo. Make sure your Expo development server is running.'
        )
      }

      const url = `http://${hostIP}:8081`
      console.log('[getBaseUrl] Development mode (mobile):', url)
      return url
    }
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
