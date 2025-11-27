import { usePurchasesStore } from '@/system/purchases'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import Purchases, { type PurchasesOfferings } from 'react-native-purchases'
import {
  AccountCard,
  HeaderCard,
  JsonViewerCard,
  OfferingCard
} from './components'

export default function PurchasesScreen() {
  const {
    isPremium,
    customerInfo,
    setCustomerInfo,
    activeEntitlementIds,
    isCustomerInfoFresh
  } = usePurchasesStore()

  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null)
  const [appUserId, setAppUserId] = useState<string | null>(null)

  const currentOffering = offerings?.current ?? null
  const packageCount = currentOffering?.availablePackages?.length ?? 0
  const entitlementCount = activeEntitlementIds.length

  // Initial load
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [off, userId] = await Promise.all([
        Purchases.getOfferings().catch(() => null),
        Purchases.getAppUserID().catch(() => null)
      ])
      if (off) setOfferings(off)
      if (userId) setAppUserId(userId)
    } catch {
      // Silently fail
    }
  }

  const handleRefresh = async () => {
    try {
      const [off, info] = await Promise.all([
        Purchases.getOfferings().catch(() => null),
        Purchases.getCustomerInfo().catch(() => null)
      ])
      if (off) setOfferings(off)
      if (info) setCustomerInfo(info)
    } catch {
      // Silently fail
    }
  }

  const handleLogDebug = () => {
    console.log('[Purchases] offerings:', offerings)
    console.log('[Purchases] customerInfo:', customerInfo)
    console.log('[Purchases] appUserId:', appUserId)
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <HeaderCard
          appUserId={appUserId}
          isPremium={isPremium}
          isCustomerInfoFresh={isCustomerInfoFresh}
          packageCount={packageCount}
          entitlementCount={entitlementCount}
          onRefresh={handleRefresh}
          onLogDebug={handleLogDebug}
        />

        {currentOffering && <OfferingCard offering={currentOffering} />}

        {customerInfo && (
          <AccountCard
            customerInfo={customerInfo}
            appUserId={appUserId}
            isPremium={isPremium}
          />
        )}

        <JsonViewerCard offerings={offerings} customerInfo={customerInfo} />
      </ScrollView>
    </View>
  )
}
