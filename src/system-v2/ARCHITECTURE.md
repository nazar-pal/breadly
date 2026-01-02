# Architecture: Technical Implementation

This document provides a deep-dive into the technical implementation of `system-v2`. It covers the state machine, transitions, side effects, and debugging.

For a product/feature perspective, see [BUSINESS-LOGIC.md](./BUSINESS-LOGIC.md).
For a quick overview, see [README.md](./README.md).

---

## Table of Contents

- [Core Concepts](#core-concepts)
- [State Machine](#state-machine)
- [User Flows (Technical)](#user-flows-technical)
- [Key Components](#key-components)
- [Testing](#testing)
- [Debugging](#debugging)
- [Migration from system/ to system-v2/](#migration-from-system-to-system-v2)

---

## Core Concepts

### Schema Modes

PowerSync uses two schema modes:

| Mode           | Tables                      | Use Case                              |
| -------------- | --------------------------- | ------------------------------------- |
| **Local-only** | `local_*` tables            | Guest users, free authenticated users |
| **Synced**     | Regular tables with `ps_id` | Premium users with cloud backup       |

### Data Flow

```
User Action
    │
    ▼
External State Change (Clerk/RevenueCat)
    │
    ▼
Event Derived (deriveEvent)
    │
    ▼
State Transition (transition)
    │
    ▼
Side Effect Executed (executeStateAction)
    │
    ▼
New State + UI Update
```

### New vs Existing Account Detection

When a user authenticates via Google OAuth, we need to determine if this is a new or existing account to choose the correct flow.

**Detection mechanism:** Clerk provides a `createdSessionId` that matches the current session ID only on first sign-in. We compare these to determine:

```typescript
const isNewAccount = session.createdSessionId === session.id
```

**How it affects the state machine:**

- `USER_AUTHENTICATED` event includes `isExistingAccount` flag
- `MIGRATION_COMPLETE` event uses this flag to determine next state:
  - New account → `local_only` (if free) or `switching_to_sync` (if premium)
  - Existing account without premium → `blocked_no_sync`
  - Existing account with premium → `switching_to_sync`

### Purchase Status Verification

The FSM guards against stale purchase data using `isPurchaseStatusVerified`:

- **What it is**: A flag indicating whether RevenueCat has verified the user's subscription status with the network (not just cached data).
- **Why it matters**: Prevents incorrect state transitions based on stale cached data. For example, without this guard, a cached `isPremium=true` could trigger `SUBSCRIPTION_ACTIVATED` even if the subscription actually expired.
- **Behavior**:
  - Events requiring purchase status (like `SUBSCRIPTION_ACTIVATED`, `SUBSCRIPTION_EXPIRED`) are only derived after verification
  - Initialization proceeds without waiting for verification (guest users don't need it)
  - UI shows "Verifying subscription..." during this check

---

## State Machine

### States

| State                     | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `uninitialized`           | App just launched, waiting for session                                                         |
| `initializing`            | PowerSync initializing, gathering context                                                      |
| `seeding_guest`           | Creating default data for new guest (queues `USER_AUTHENTICATED` in `pendingAuth` if received) |
| `local_only`              | Running in local-only mode (guest or free user)                                                |
| `migrating_guest_to_auth` | Moving guest data to authenticated user ID                                                     |
| `blocked_no_sync`         | User signed into existing account without subscription; must choose action                     |
| `switching_to_sync`       | Changing schema to synced mode                                                                 |
| `synced`                  | Running with full cloud sync (premium)                                                         |
| `draining_upload_queue`   | Waiting for pending uploads before disabling sync                                              |
| `switching_to_local`      | Changing schema to local-only mode                                                             |
| `signing_out`             | Performing sign-out cleanup (Clerk, PowerSync)                                                 |
| `deleting_account`        | Permanently deleting user account from Clerk and backend                                       |
| `error`                   | Error occurred, can retry                                                                      |

### Events

| Event                    | Trigger                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `APP_START`              | App launched with session available                                                 |
| `INIT_COMPLETE`          | PowerSync initialized, context gathered (includes optional `guestId` for migration) |
| `SEEDING_COMPLETE`       | Default data created for guest                                                      |
| `USER_AUTHENTICATED`     | Guest user signed in                                                                |
| `MIGRATION_COMPLETE`     | Guest data moved to auth user ID                                                    |
| `SUBSCRIPTION_ACTIVATED` | User purchased premium (from `local_only` or `blocked_no_sync`)                     |
| `SUBSCRIPTION_EXPIRED`   | Premium subscription ended                                                          |
| `QUEUE_DRAINED`          | All pending uploads completed                                                       |
| `QUEUE_DRAIN_TIMEOUT`    | Timeout waiting for uploads                                                         |
| `SCHEMA_SWITCH_COMPLETE` | Schema change finished                                                              |
| `USER_SIGNED_OUT`        | User clicked sign out (after UI confirmation completes)                             |
| `SIGN_OUT_COMPLETE`      | Sign-out cleanup finished                                                           |
| `ACCOUNT_DELETE_REQUESTED` | User confirmed account deletion from blocked state                                |
| `ACCOUNT_DELETE_COMPLETE` | Account deletion finished (Clerk + backend cleanup done)                           |
| `ERROR`                  | An error occurred                                                                   |
| `RETRY`                  | User requested retry from error state                                               |

### State Diagram

```
                         ┌─────────────────┐
                         │  uninitialized  │◄──────────────────────────────────────┐
                         └────────┬────────┘                                       │
                                  │ APP_START                                      │
                                  ▼                                                │
                         ┌─────────────────┐                                       │
                         │  initializing   │                                       │
                         └────────┬────────┘                                       │
                                  │                                                │
            ┌─────────────────────┼─────────────────────┐                          │
            │                     │                     │                          │
            ▼                     ▼                     ▼                          │
   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐                 │
   │  seeding_guest  │◄┐ │   local_only    │   │ migrating_guest │                 │
   └────────┬────────┘ │ └────────┬────────┘   │    _to_auth     │                 │
            │          │          │            └────────┬────────┘                 │
            │ USER_    │          │                     │                          │
            │ AUTHED*  │          │                     │ MIGRATION_COMPLETE       │
            └──────────┘          │                     │                          │
            │ SEEDING_COMPLETE    │         ┌───────────┼───────────┐              │
            └─────────────────────┤         │           │           │              │
                                  │         ▼           ▼           ▼              │
                                  │  (new+premium) (new+free) (existing+no_sync)   │
                                  │         │           │           │              │
                                  │         │           │           ▼              │
                                  │         │           │  ┌─────────────────┐     │
                                  │         │           │  │ blocked_no_sync │     │
                                  │         │           │  └────────┬────────┘     │
                                  │         │           │           │              │
                                  │         │           │  ┌────────┼────────┐     │
                                  │ SUBSCRIPTION_       │  │        │        │     │
                                  │ ACTIVATED           │  │ SUBSCR │ SIGN   │ DEL │
                                  │         │           │  │ ACTIV  │ OUT    │ ACCT│
                                  ▼         ▼           ▼  ▼        ▼        ▼     │
                         ┌─────────────────┐   ┌───────────────┐  ┌──────────────┐ │
                         │switching_to_sync│◄──┤ (to local_only│  │deleting_acct │ │
                         └────────┬────────┘   │  if new+free) │  └──────┬───────┘ │
                                  │            └───────────────┘         │         │
                                  │ SCHEMA_SWITCH_COMPLETE               │         │
                                  ▼                                      │         │
                         ┌─────────────────┐                             │         │
                         │     synced      │                             │         │
                         └────────┬────────┘                             │         │
                                  │                                      │         │
           ┌──────────────────────┼──────────────────────┐               │         │
           │ SUBSCRIPTION_EXPIRED │ USER_SIGNED_OUT      │               │         │
           ▼                      ▼                      │               │         │
   ┌───────────────┐     ┌───────────────┐               │               │         │
   │(has queue)    │     │  signing_out  │───────────────┼───────────────┼─────────┤
   ▼               │     └───────────────┘               │               │         │
   ┌─────────────────────┐        SIGN_OUT_COMPLETE      │   ACCOUNT_DELETE_COMPLETE
   │draining_upload_queue│                               │               │         │
   └────────┬────────────┘                               │               │         │
            │                                            │               │         │
            │ QUEUE_DRAINED                              │               │         │
            ▼                                            │               │         │
   ┌─────────────────────┐                               │               │         │
   │  switching_to_local │◄──────────────────────────────┘               │         │
   └────────┬────────────┘ (no queue)                                    │         │
            │                                                            │         │
            │ SCHEMA_SWITCH_COMPLETE                                     │         │
            ▼                                                            │         │
   ┌─────────────────┐                                                   │         │
   │   local_only    │───────────────────────────────────────────────────┴─────────┘
   └─────────────────┘ (USER_SIGNED_OUT → signing_out)
```

**Notes:**

- `local_only` also transitions to `signing_out` on `USER_SIGNED_OUT`, which then completes to `uninitialized`.
- `*USER_AUTHED`: If `USER_AUTHENTICATED` occurs during `seeding_guest`, it is queued in `pendingAuth` and processed after `SEEDING_COMPLETE` (see Flow 6).
- `blocked_no_sync` is entered when signing into an existing account without an active subscription. User must choose: purchase, delete account, or sign out.
- `deleting_account` handles permanent account deletion from Clerk and backend.

---

## User Flows (Technical)

These flows describe the implementation-level behavior of the state machine.

### Flow 1: Fresh Install (Guest User)

1. App launches → `uninitialized`
2. `useClerkSession` creates guest UUID → session available
3. `APP_START` event → `initializing`
4. PowerSync initializes, checks if seeding needed
5. `INIT_COMPLETE` with `needsSeed=true` → `seeding_guest`
6. Default categories/accounts created
7. `SEEDING_COMPLETE` → `local_only`
8. User can now use the app locally

### Flow 2: Guest Signs In

1. User in `local_only` (guest)
2. Signs in via Google OAuth
3. `useClerkSession` updates session with Clerk ID
4. `USER_AUTHENTICATED` event → `migrating_guest_to_auth`
5. All data updated from guest UUID to Clerk user ID
6. `MIGRATION_COMPLETE` event
7. If user has subscription → `switching_to_sync` → `synced`
8. If no subscription → `local_only` (as authenticated)

### Flow 3: User Subscribes to Premium

1. User in `local_only` (authenticated, free)
2. Purchases subscription via RevenueCat
3. `usePurchasesListener` updates `isPremium=true`
4. `SUBSCRIPTION_ACTIVATED` event → `switching_to_sync`
5. Schema switched to synced tables
6. PowerSync connects to backend
7. `SCHEMA_SWITCH_COMPLETE` → `synced`
8. Data syncs to cloud

### Flow 4: Subscription Expires

1. User in `synced` state
2. Subscription expires, RevenueCat updates
3. `isPremium=false` triggers `SUBSCRIPTION_EXPIRED`
4. If upload queue has pending changes → `draining_upload_queue`
   - Wait up to 30 seconds for uploads
   - `QUEUE_DRAINED` or `QUEUE_DRAIN_TIMEOUT`
5. `switching_to_local`
6. Schema switched to local-only tables
7. `SCHEMA_SWITCH_COMPLETE` → `local_only`
8. User keeps local data, loses sync

### Flow 5: User Signs Out

1. User in `local_only` or `synced` state
2. User clicks sign out button
3. **UI-level confirmation flow** (before event dispatch):
   - If Premium with pending uploads: show waiting screen with progress
   - User can wait for sync OR choose to sign out immediately
   - If Free user OR pending uploads exist: show typed confirmation dialog
   - User must confirm or cancel
4. Only after confirmation: `SignOutButton` dispatches `USER_SIGNED_OUT` event
5. State transitions to `signing_out`
6. `executeStateAction` performs cleanup:
   - Clerk sign out
   - PowerSync disconnect and clear synced data
   - Switch to local schema
   - Restore preserved data (if any) or create new guest session
   - Seed default data (if fresh session)
7. `SIGN_OUT_COMPLETE` event → `uninitialized`
8. Normal initialization flow creates guest session

**Note:** The `USER_SIGNED_OUT` event represents a **confirmed** decision. All data loss warnings and confirmations are handled at the UI layer before this event is dispatched. This separation keeps the state machine simple while ensuring users cannot accidentally lose data.

### Flow 6: Authentication During Seeding

1. User in `seeding_guest` state (first app launch)
2. User quickly signs in via OAuth before seeding completes
3. `USER_AUTHENTICATED` event is **queued** (stored in `pendingAuth`)
4. Seeding continues normally
5. `SEEDING_COMPLETE` event checks for `pendingAuth`
6. If pending auth exists → `migrating_guest_to_auth` (skips `local_only`)
7. Normal post-migration flow continues

### Flow 7: Sign-In to Existing Account (No Subscription)

1. User in `local_only` (guest) with ≥10 transactions
2. Signs in via Google OAuth to an **existing** account (Clerk indicates not first sign-in)
3. Account has no active subscription
4. `USER_AUTHENTICATED` event → `migrating_guest_to_auth`
5. `MIGRATION_COMPLETE` with `isExistingAccount=true` and `isPremium=false`
6. Local data is preserved to backup storage
7. State transitions to `blocked_no_sync`
8. User sees mandatory screen with 3 options:
   - **Purchase subscription** → `SUBSCRIPTION_ACTIVATED` → `switching_to_sync`
   - **Delete account** → `ACCOUNT_DELETE_REQUESTED` → `deleting_account` → `ACCOUNT_DELETE_COMPLETE` → `uninitialized`
   - **Sign out** → `USER_SIGNED_OUT` → `signing_out` → `SIGN_OUT_COMPLETE` → `uninitialized`
9. On sign-out or account deletion, preserved local data is restored

### Flow 8: Account Deletion

1. User in `blocked_no_sync` state (or initiated from settings)
2. User confirms account deletion with typed confirmation
3. `ACCOUNT_DELETE_REQUESTED` event → `deleting_account`
4. `executeStateAction` performs:
   - Delete all user data from backend
   - Delete Clerk account
   - Clear local synced data
   - Restore preserved local data (if any) or create fresh guest session
5. `ACCOUNT_DELETE_COMPLETE` event → `uninitialized`
6. Normal initialization flow creates guest session

---

## Key Components

### SyncOrchestrator

The main provider component that:

- Initializes `useClerkSession` and `usePurchasesListener` hooks
- Manages the FSM via `useReducer`
- Derives events from external state changes
- Executes side effects based on state
- Renders loading/error UI during transitions
- Provides PowerSync context to children

```tsx
// Usage in _layout.native.tsx
<ClerkProvider>
  <ClerkLoaded>
    <SyncOrchestrator>
      <App />
    </SyncOrchestrator>
  </ClerkLoaded>
</ClerkProvider>
```

### State Persistence

State is persisted to MMKV on every transition for crash recovery:

```typescript
// On transition
if (newState.status !== 'uninitialized') {
  persistedSyncState.save(newState)
}

// On mount
const persisted = persistedSyncState.load()
if (persisted) {
  return persisted // Resume from persisted state
}
```

**Stale Error Auto-Clear**: Error states are automatically cleared if they are older than 1 hour. This prevents users from being stuck on an error screen indefinitely if they force-quit the app while an error is displayed. The timestamp is saved with each state, and on load, stale error states are discarded:

```typescript
const ERROR_STATE_MAX_AGE_MS = 60 * 60 * 1000 // 1 hour

// On load, clear stale errors
if (state.status === 'error' && age > ERROR_STATE_MAX_AGE_MS) {
  persistedSyncState.clear()
  return null // Start fresh
}
```

### Upload Queue Draining

When a subscription expires, we don't immediately cut off sync. Instead:

1. Check if there are pending uploads
2. If yes, enter `draining_upload_queue` state
3. Wait up to 30 seconds for uploads to complete
4. Only then switch to local-only mode

This prevents data loss for users whose subscriptions lapse.

---

## Testing

The FSM design enables easy testing:

```typescript
// Test pure transitions
import { transition } from './state-machine'

test('subscription expired with queue drains first', () => {
  const state = { status: 'synced', userId: 'user-1' }
  const event = { type: 'SUBSCRIPTION_EXPIRED', hasUploadQueue: true }

  const next = transition(state, event)

  expect(next.status).toBe('draining_upload_queue')
})
```

---

## Debugging

Enable PowerSync debug logging:

```typescript
const logger = createBaseLogger()
logger.useDefaults()
logger.setLevel(LogLevel.DEBUG)
```

State transitions are logged in development:

```
[SyncOrchestrator] State: initializing → seeding_guest
[SyncOrchestrator] State: seeding_guest → local_only
```

---

## Migration from system/ to system-v2/

The old `system/` folder used:

- Separate providers for each concern
- Flags in persistent store (`syncEnabled`, `needToReplaceGuestWithAuthUserId`)
- Large `useEffect` with 12+ dependencies

The new `system-v2/` folder uses:

- Single orchestrator component
- Explicit state machine
- Separated pure logic from side effects

To migrate, simply replace:

```tsx
// Old
<UserSessionInitializer>
  <PurchasesInitializer>
    <PowerSyncContextProvider>
      {children}
    </PowerSyncContextProvider>
  </PurchasesInitializer>
</UserSessionInitializer>

// New
<SyncOrchestrator>
  {children}
</SyncOrchestrator>
```
