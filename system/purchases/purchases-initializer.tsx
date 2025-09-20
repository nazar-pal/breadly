import { env } from '@/env'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import Purchases, {
  LOG_LEVEL,
  type CustomerInfoUpdateListener
} from 'react-native-purchases'
import { useUserSession } from '../session-and-migration'
import { usePurchasesStore } from './purchases-store'

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

export function PurchasesInitializer() {
  const { setCustomerInfo, setIsCustomerInfoFresh } = usePurchasesStore()
  const { userId, isGuest } = useUserSession()
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
    if (!apiKey || isGuest) return
    Purchases.getAppUserID()
      .then(currentId => {
        if (currentId === userId) return
        return Purchases.logIn(userId)
          .then(result => {
            setCustomerInfo(result.customerInfo)
            setIsCustomerInfoFresh(true)
          })
          .catch(() => {})
      })
      .catch(() => {})
  }, [apiKey, userId, isGuest, setCustomerInfo, setIsCustomerInfoFresh])

  // Ensure we log out when switching to guest (safe offline)
  useEffect(() => {
    if (!apiKey || !isGuest) return
    Purchases.getAppUserID()
      .then(currentId => {
        const isAnonymous =
          !currentId || currentId.startsWith('$RCAnonymousID:')
        if (isAnonymous) return

        return Purchases.logOut()
          .then(info => {
            setCustomerInfo(info)
            setIsCustomerInfoFresh(true)
          })
          .catch(() => {})
      })
      .catch(() => {})
  }, [apiKey, isGuest, setCustomerInfo, setIsCustomerInfoFresh])

  return null
}
