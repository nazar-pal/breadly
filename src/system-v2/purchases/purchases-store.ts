import { type CustomerInfo } from 'react-native-purchases'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

export type PurchasesStoreState = {
  customerInfo: CustomerInfo | null
  isPremium: boolean
  activeEntitlementIds: string[]
  /**
   * Whether the purchase status has been verified with the network.
   * When false, isPremium may be stale (from cache).
   * UI can use this to show "Verifying subscription..." indicators.
   */
  isPurchaseStatusVerified: boolean
}

export type PurchasesStoreActions = {
  setCustomerInfo: (customerInfo: CustomerInfo | null) => void
  setPurchaseStatusVerified: (verified: boolean) => void
}

export type PurchasesStore = PurchasesStoreState & PurchasesStoreActions

function deriveIsPremium(customerInfo: CustomerInfo | null): boolean {
  if (!customerInfo) return false
  const activeEntitlements = customerInfo.entitlements?.active ?? {}
  return Object.keys(activeEntitlements).length > 0
}

function deriveActiveEntitlementIds(
  customerInfo: CustomerInfo | null
): string[] {
  if (!customerInfo) return []
  const activeEntitlements = customerInfo.entitlements?.active ?? {}
  return Object.keys(activeEntitlements)
}

export const purchasesStore = create<PurchasesStore>(set => ({
  customerInfo: null,
  isPremium: false,
  activeEntitlementIds: [],
  isPurchaseStatusVerified: false,
  setCustomerInfo: customerInfo =>
    set({
      customerInfo,
      isPremium: deriveIsPremium(customerInfo),
      activeEntitlementIds: deriveActiveEntitlementIds(customerInfo)
    }),
  setPurchaseStatusVerified: verified =>
    set({ isPurchaseStatusVerified: verified })
}))

export const usePurchases = () => {
  return purchasesStore(
    useShallow(state => ({
      isPremium: state.isPremium,
      isPurchaseStatusVerified: state.isPurchaseStatusVerified,
      customerInfo: state.customerInfo,
      activeEntitlementIds: state.activeEntitlementIds,
      setCustomerInfo: state.setCustomerInfo,
      setPurchaseStatusVerified: state.setPurchaseStatusVerified
    }))
  )
}
