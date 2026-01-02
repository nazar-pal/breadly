import { usePurchases } from '@/system-v2/purchases'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import Purchases, { type PurchasesOfferings } from 'react-native-purchases'
import {
  AccountCard,
  ActionButtons,
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
    isPurchaseStatusVerified
  } = usePurchases()

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
    <View className="bg-background flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 12 }}>
        <ActionButtons onRefresh={handleRefresh} onLogDebug={handleLogDebug} />

        <HeaderCard
          appUserId={appUserId}
          isPremium={isPremium}
          isPurchaseStatusVerified={isPurchaseStatusVerified}
          packageCount={packageCount}
          entitlementCount={entitlementCount}
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
