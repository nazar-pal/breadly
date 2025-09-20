import { type CustomerInfo } from 'react-native-purchases'
import { create } from 'zustand'

export type PurchasesStoreState = {
  customerInfo: CustomerInfo | null
  isPremium: boolean
  activeEntitlementIds: string[]
  isCustomerInfoFresh: boolean
}

export type PurchasesStoreActions = {
  setCustomerInfo: (customerInfo: CustomerInfo | null) => void
  setIsCustomerInfoFresh: (fresh: boolean) => void
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

export const usePurchasesStore = create<PurchasesStore>(set => ({
  customerInfo: null,
  isPremium: false,
  activeEntitlementIds: [],
  isCustomerInfoFresh: false,
  setCustomerInfo: customerInfo =>
    set({
      customerInfo,
      isPremium: deriveIsPremium(customerInfo),
      activeEntitlementIds: deriveActiveEntitlementIds(customerInfo)
    }),
  setIsCustomerInfoFresh: fresh => set({ isCustomerInfoFresh: fresh })
}))
