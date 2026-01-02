import { storage } from '@/lib/storage/mmkv'
import { PowerSyncContext } from '@powersync/react-native'
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react'
import { ErrorBoundary } from '../components/error-boundary'
import { LoadingStates } from '../components/loading-states'
import { GUEST_DATA_STORAGE_KEY } from '../const/storage-keys'
import { powersync } from '../powersync/database'
import { usePurchases } from '../purchases'
import { usePurchasesListener } from '../purchases/use-purchases-listener'
import { useSession } from '../session'
import { persistedSyncState } from '../session/persistent-state'
import { sessionStore } from '../session/session-store'
import { useClerkSession } from '../session/use-clerk-session'
import {
  deriveEvent,
  transition,
  type SyncEvent,
  type SyncState
} from '../state-machine'
import {
  checkDbForGuestData,
  executeStateAction,
  gatherInitContext
} from './execute-state-action'
import { SyncStateProvider } from './use-sync-state'

/**
 * Reducer for sync state machine
 */
function syncReducer(state: SyncState, event: SyncEvent): SyncState {
  const newState = transition(state, event)

  // Persist state on every transition (except uninitialized)
  if (newState.status !== 'uninitialized') {
    persistedSyncState.save(newState)
  }

  return newState
}

/**
 * Get guest ID from persistent storage
 */
function getPersistedGuestId(): string | null {
  const persisted = storage.getString(GUEST_DATA_STORAGE_KEY)
  if (persisted) {
    try {
      const parsed = JSON.parse(persisted)
      return parsed.state?.guestId || null
    } catch {
      // Ignore parse errors
    }
  }
  return null
}

/**
 * Init context type - replaces the ref with proper state
 */
type InitContext = {
  hasGuestData: boolean
  needsSeed: boolean
  guestId: string | null
}

/**
 * Main sync orchestrator component
 * Replaces UserSessionInitializer, PurchasesInitializer, and PowerSyncContextProvider
 */
export function SyncOrchestrator({ children }: { children: React.ReactNode }) {
  // Initialize hooks for external state
  useClerkSession()
  usePurchasesListener()

  const { session } = useSession()
  const { isPremium, isPurchaseStatusVerified } = usePurchases()

  const initialState: SyncState = (() => {
    // Try to restore persisted state on mount
    const persisted = persistedSyncState.load()
    if (persisted && persisted.status !== 'uninitialized') {
      return persisted
    }
    return { status: 'uninitialized' }
  })()

  const [state, dispatch] = useReducer(syncReducer, initialState)

  // Use proper state instead of ref for init context (fixes react-hooks/exhaustive-deps)
  const [initContext, setInitContext] = useState<InitContext | null>(null)

  const actionAbortControllerRef = useRef<AbortController | null>(null)

  // Effect 1: Derive events from external state changes
  useEffect(() => {
    let cancelled = false

    if (!session) return

    // Gather context for initialization
    if (state.status === 'initializing' && !initContext) {
      const guestId = getPersistedGuestId()

      gatherInitContext({
        userId: session.userId,
        isGuest: session.isGuest
      })
        .then(async context => {
          if (cancelled) return

          // Check for guest data if authenticated user
          let hasGuestData = false
          if (!session.isGuest && guestId) {
            hasGuestData = await checkDbForGuestData(guestId)
          }

          if (cancelled) return

          // Update state with init context
          setInitContext({
            hasGuestData,
            needsSeed: context.needsSeed,
            guestId
          })

          // Trigger INIT_COMPLETE event with guestId for migration
          const initEvent: SyncEvent = {
            type: 'INIT_COMPLETE',
            userId: session.userId,
            isGuest: session.isGuest,
            isPremium: isPurchaseStatusVerified ? isPremium : false,
            hasGuestData,
            needsSeed: context.needsSeed,
            guestId: hasGuestData ? (guestId ?? undefined) : undefined
          }

          dispatch(initEvent)
        })
        .catch(error => {
          if (cancelled) return
          dispatch({ type: 'ERROR', error })
        })

      return () => {
        cancelled = true
      }
    }

    // Only process other events when purchase status is verified
    if (!isPurchaseStatusVerified && state.status !== 'initializing') return

    // Check upload queue for subscription expiry handling
    if (state.status === 'synced' || state.status === 'draining_upload_queue') {
      powersync
        .getNextCrudTransaction()
        .then(transaction => {
          if (cancelled) return
          const hasUploadQueue = transaction !== null

          if (state.status === 'synced' && !isPremium) {
            dispatch({
              type: 'SUBSCRIPTION_EXPIRED',
              hasUploadQueue
            })
          } else if (
            state.status === 'draining_upload_queue' &&
            !hasUploadQueue
          ) {
            dispatch({ type: 'QUEUE_DRAINED' })
          }
        })
        .catch(() => {
          // Ignore errors checking status
        })
    }

    // Derive other events
    const event = deriveEvent(state, {
      userId: session.userId,
      isGuest: session.isGuest,
      isPremium,
      isPurchaseStatusVerified,
      hasGuestData: initContext?.hasGuestData ?? false,
      needsSeed: initContext?.needsSeed ?? false,
      hasUploadQueue: false // Will be checked separately
    })

    if (event) {
      dispatch(event)
    }

    return () => {
      cancelled = true
    }
  }, [state, session, isPremium, isPurchaseStatusVerified, initContext])

  // Effect 2: Execute side effects based on state
  useEffect(() => {
    // Abort previous action if still running
    if (actionAbortControllerRef.current) {
      actionAbortControllerRef.current.abort()
    }

    // Skip if state doesn't need action (no-op states)
    if (
      state.status === 'uninitialized' ||
      state.status === 'initializing' ||
      state.status === 'local_only' ||
      state.status === 'synced' ||
      state.status === 'error'
    ) {
      return
    }

    // Create new abort controller for this action
    const controller = new AbortController()
    actionAbortControllerRef.current = controller

    // Execute action
    executeStateAction(state, controller.signal)
      .then(event => {
        if (controller.signal.aborted) return

        // Null means no action needed for this state
        if (!event) return

        // Update isPremium in migration complete event if needed
        if (
          event.type === 'MIGRATION_COMPLETE' &&
          session &&
          !session.isGuest &&
          isPurchaseStatusVerified
        ) {
          event = { ...event, isPremium }
        }

        dispatch(event)

        // Handle SIGN_OUT_COMPLETE: Set session with new guest ID
        // This must happen after dispatch to avoid race conditions
        // (Setting session before dispatch would trigger Effect 2 to re-run mid-action)
        if (event.type === 'SIGN_OUT_COMPLETE') {
          sessionStore.getState().actions.setSession({
            userId: event.newGuestId,
            isGuest: true
          })
        }
      })
      .catch(error => {
        if (controller.signal.aborted) return
        dispatch({ type: 'ERROR', error })
      })

    return () => {
      controller.abort()
    }
  }, [state, session, isPremium, isPurchaseStatusVerified])

  // Handle APP_START event
  useEffect(() => {
    if (state.status === 'uninitialized' && session) {
      dispatch({ type: 'APP_START' })
    }
  }, [state.status, session])

  // Effect 3: Monitor drain queue timeout as a safety net
  // The action itself has a timeout, but this ensures we don't get stuck if the action fails
  useEffect(() => {
    if (state.status !== 'draining_upload_queue') return

    const DRAIN_TIMEOUT_MS = 30000
    const elapsed = Date.now() - state.startedAt
    const remaining = DRAIN_TIMEOUT_MS - elapsed

    // If already past timeout, dispatch immediately
    if (remaining <= 0) {
      dispatch({ type: 'QUEUE_DRAIN_TIMEOUT' })
      return
    }

    // Set a timer for the remaining time
    const timeoutId = setTimeout(() => {
      dispatch({ type: 'QUEUE_DRAIN_TIMEOUT' })
    }, remaining)

    return () => clearTimeout(timeoutId)
  }, [state])

  // Sign out handler - dispatches USER_SIGNED_OUT event to trigger FSM transition
  const handleSignOut = useCallback(() => {
    dispatch({ type: 'USER_SIGNED_OUT' })
  }, [])

  // Show loading UI for loading states
  if (state.status === 'error') {
    return (
      <ErrorBoundary
        error={state.error}
        onRetry={() => dispatch({ type: 'RETRY' })}
      />
    )
  }

  if (
    !session || // Wait for session before rendering children
    state.status === 'uninitialized' ||
    state.status === 'initializing' ||
    state.status === 'seeding_guest' ||
    state.status === 'migrating_guest_to_auth' ||
    state.status === 'switching_to_sync' ||
    state.status === 'switching_to_local' ||
    state.status === 'draining_upload_queue' ||
    state.status === 'signing_out'
  ) {
    return <LoadingStates state={state} />
  }

  return (
    <PowerSyncContext.Provider value={powersync}>
      <SyncStateProvider state={state} signOut={handleSignOut}>
        {children}
      </SyncStateProvider>
    </PowerSyncContext.Provider>
  )
}
