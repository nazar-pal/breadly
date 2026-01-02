import { env } from '@/env'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import Purchases, {
  LOG_LEVEL,
  type CustomerInfoUpdateListener
} from 'react-native-purchases'
import { useSession } from '../session'
import { usePurchases } from './purchases-store'

let purchasesConfigured = false

function getApiKey(): string | null {
  switch (Platform.OS) {
    case 'ios':
      return env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
    case 'android':
      return env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
    default:
      return null
  }
}

/**
 * Hook that initializes RevenueCat and syncs purchase state
 */
export function usePurchasesListener() {
  const { setCustomerInfo, setPurchaseStatusVerified } = usePurchases()
  const { session } = useSession()
  const apiKey = getApiKey()

  // Configure SDK, subscribe to updates, and bootstrap state
  useEffect(() => {
    if (!apiKey) return
    if (!purchasesConfigured) {
      if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
      Purchases.configure({ apiKey })
      purchasesConfigured = true
    }

    const listener: CustomerInfoUpdateListener = info => setCustomerInfo(info)
    Purchases.addCustomerInfoUpdateListener(listener)

    // Bootstrap from cached info (non-blocking, safe offline)
    Purchases.getCustomerInfo()
      .then(info => setCustomerInfo(info))
      .catch(() => {})

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener)
    }
  }, [apiKey, setCustomerInfo])

  // Identify authenticated users (switching accounts does not require logOut)
  useEffect(() => {
    if (!apiKey || !session || session.isGuest) return
    Purchases.getAppUserID()
      .then(currentId => {
        if (currentId === session.userId) {
          // Already logged in as this user, mark as verified
          setPurchaseStatusVerified(true)
          return
        }
        return Purchases.logIn(session.userId)
          .then(result => {
            setCustomerInfo(result.customerInfo)
            setPurchaseStatusVerified(true)
          })
          .catch(() => {})
      })
      .catch(() => {})
  }, [apiKey, session, setCustomerInfo, setPurchaseStatusVerified])

  // Ensure we log out when switching to guest (safe offline)
  useEffect(() => {
    if (!apiKey || !session || !session.isGuest) return
    Purchases.getAppUserID()
      .then(currentId => {
        const isAnonymous =
          !currentId || currentId.startsWith('$RCAnonymousID:')
        if (isAnonymous) return

        return Purchases.logOut()
          .then(info => {
            setCustomerInfo(info)
            setPurchaseStatusVerified(true)
          })
          .catch(() => {})
      })
      .catch(() => {})
  }, [apiKey, session, setCustomerInfo, setPurchaseStatusVerified])
}
