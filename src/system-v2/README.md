# System-v2: Unified Sync Orchestration

This module orchestrates authentication (Clerk), subscriptions (RevenueCat), and database synchronization (PowerSync) in Breadly. It uses a finite state machine (FSM) to manage complex state transitions predictably and safely.

## Documentation

| Document                                 | Description                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| [BUSINESS-LOGIC.md](./BUSINESS-LOGIC.md) | User types, feature matrix, and user journeys from a product perspective       |
| [ARCHITECTURE.md](./ARCHITECTURE.md)     | Technical deep-dive: FSM states, events, transitions, debugging, and migration |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      SyncOrchestrator                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    Clerk     │  │  RevenueCat  │  │     PowerSync        │  │
│  │   (Auth)     │  │ (Purchases)  │  │    (Database)        │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│         ▼                 ▼                      ▼              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   State Machine                            │ │
│  │  Events ──► Transitions ──► States ──► Actions             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Why a State Machine?

The previous implementation used multiple `useEffect` hooks with complex dependency arrays, leading to race conditions and hard-to-trace bugs. The FSM approach provides:

- **Explicit states**: Every possible app state is defined
- **Predictable transitions**: State changes only happen via defined events
- **Testability**: Pure transition function with no side effects
- **Crash recovery**: State is persisted to MMKV

---

## Usage

```tsx
// In _layout.native.tsx
<ClerkProvider>
  <ClerkLoaded>
    <SyncOrchestrator>
      <App />
    </SyncOrchestrator>
  </ClerkLoaded>
</ClerkProvider>
```

---

## Folder Structure

```
system-v2/
├── index.ts                 # Main exports
├── README.md                # This file
├── BUSINESS-LOGIC.md        # Product/feature documentation
├── ARCHITECTURE.md          # Technical documentation
│
├── state-machine/           # Pure FSM logic (no side effects)
│   ├── states.ts            # State type definitions
│   ├── events.ts            # Event types + deriveEvent()
│   ├── transition.ts        # Pure transition function
│   └── guards.ts            # Transition guard functions
│
├── orchestrator/            # React integration
│   ├── sync-orchestrator.tsx    # Main provider component
│   ├── execute-state-action.ts  # Side effect executor
│   ├── use-sync-state.tsx       # State context hook
│   └── use-sync-enabled.ts      # Compatibility hook
│
├── actions/                 # Side effect implementations
│   ├── initialize-powersync.ts
│   ├── seed-guest-data.ts
│   ├── migrate-guest-to-auth.ts
│   ├── switch-to-synced-schema.ts
│   ├── switch-to-local-schema.ts
│   ├── drain-upload-queue.ts
│   ├── ensure-currencies-seeded.ts
│   └── sign-out-user.ts
│
├── session/                 # User session management
│   ├── session-store.ts         # Zustand store for session
│   ├── use-clerk-session.ts     # Clerk → session sync
│   ├── persistent-state.ts      # MMKV state persistence
│   ├── use-user-session.ts      # Compatibility hook
│   └── use-warm-up-browser.ts   # OAuth browser warm-up
│
├── purchases/               # RevenueCat integration
│   ├── purchases-store.ts       # Zustand store for purchases
│   ├── use-purchases-listener.ts # RevenueCat listener
│   └── paywall.tsx              # Paywall UI component
│
├── powersync/               # PowerSync configuration
│   ├── database.ts              # PowerSync instance
│   ├── connector.ts             # Backend connector
│   └── schema/                  # Schema utilities
│       ├── make-schema.ts       # Dynamic schema creation
│       ├── move-data.ts         # Data migration helpers
│       └── copy-synced-currencies-to-local.ts
│
├── components/              # Shared UI components
│   ├── loading-states.tsx       # Loading indicators
│   ├── error-boundary.tsx       # Error display
│   ├── sign-out-button.tsx      # Sign out logic
│   └── ...
│
└── const/                   # Constants
    ├── default-data.ts          # Default categories/accounts
    └── storage-keys.ts          # MMKV storage keys
```
