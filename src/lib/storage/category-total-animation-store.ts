import { create } from 'zustand'

/**
 * Store to track when a transaction was created.
 * Used to trigger animations on category totals that change after a transaction is created.
 */
interface CategoryTotalAnimationStore {
  /** Timestamp when the last transaction was created, null if none */
  lastTransactionCreatedAt: number | null
  /** Mark that a transaction was just created */
  markTransactionCreated: () => void
  /** Clear the transaction marker (e.g., when navigating between date periods) */
  clearTransactionMarker: () => void
}

export const categoryTotalAnimationStore = create<CategoryTotalAnimationStore>(
  set => ({
    lastTransactionCreatedAt: null,

    markTransactionCreated: () => set({ lastTransactionCreatedAt: Date.now() }),

    clearTransactionMarker: () => set({ lastTransactionCreatedAt: null })
  })
)
