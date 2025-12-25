import { env } from '@/env'
import Constants from 'expo-constants'

/**
 * Gets the base URL for the API with the following priority:
 * 1. Uses EXPO_PUBLIC_API_URL environment variable if set (any environment)
 * 2. In development mode only:
 *    - Web platform: Uses localhost (http://localhost:8081)
 *    - Mobile platforms: Auto-detects host IP from Expo (http://{hostIP}:8081)
 * 3. Throws error if no API URL is configured and not in development mode
 */
export const getBaseUrl = () => {
  const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '')

  const apiUrl = env.EXPO_PUBLIC_API_URL
  if (apiUrl) return normalizeBaseUrl(apiUrl)

  if (!__DEV__) throw new Error('API URL is not set')

  /**
   * Development: Platform-specific URLs for optimal performance and compatibility
   * - Web: Uses localhost for best performance and reliability
   * - Mobile: Uses actual IP address since localhost refers to the device itself
   */
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Platform } = require('react-native')

  if (Platform.OS === 'web') {
    // Web can use localhost for better performance and fewer firewall issues
    const url = 'http://localhost:8081'
    console.log('[getBaseUrl] Development mode (web):', url)
    return normalizeBaseUrl(url)
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
    return normalizeBaseUrl(url)
  }
}
