# Breadly: User Tiers and Features

This document explains how Breadly handles different user types and what features each tier provides. It's written for developers and product people who need to understand the user experience without diving into implementation details.

For technical implementation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Table of Contents

1. [User Types](#user-types)
2. [Feature Matrix](#feature-matrix)
3. [Onboarding System](#onboarding-system)
4. [User Journeys](#user-journeys)
5. [Guest Data Warning](#guest-data-warning)
6. [Sync Behavior](#sync-behavior)
7. [Multi-Device Behavior](#multi-device-behavior)
8. [Data Safety Principles](#data-safety-principles)
9. [Decision Log](#decision-log)

---

## User Types

Breadly has three user tiers, each with different capabilities:

### Guest

A user who hasn't signed in, identified by a locally-generated ID stored on their device.

**Capabilities:**

- Full access to all app features locally (budgets, transactions, categories, accounts)

**Limitations:**

- Data exists only on this device
- Data is lost if they uninstall the app or lose their phone

**Purpose:** Lets users try the app immediately without friction

### Authenticated (Free)

A user who signed in with Google but hasn't subscribed.

**Capabilities:**

- Account tied to their Google identity
- Existing guest data is migrated to their account

**Limitations:**

- Data still exists only on this device (same as guest)

**Purpose:** Creates an account for future premium upgrade, enables potential features like data export

### Authenticated (Premium)

A user with an active subscription.

**Additional Benefits:**

- Cloud backup (data backed up automatically)
- Multi-device sync (access data from any device)
- Data recovery if device is lost
- Real-time sync across devices

---

## Feature Matrix

| Feature                              | Guest | Free | Premium |
| ------------------------------------ | ----- | ---- | ------- |
| Track transactions                   | ✓     | ✓    | ✓       |
| Manage categories                    | ✓     | ✓    | ✓       |
| Manage accounts                      | ✓     | ✓    | ✓       |
| Data stored locally                  | ✓     | ✓    | ✓       |
| Works offline                        | ✓     | ✓    | ✓       |
| Cloud backup                         | ✗     | ✗    | ✓       |
| Multi-device sync                    | ✗     | ✗    | ✓       |
| Data recovery if device is lost      | ✗     | ✗    | ✓       |
| Exchange rates (currency conversion) | ✗     | ✗    | ✓       |

---

## Onboarding System

### Overview

Onboarding is a first-time setup flow that helps users configure essential preferences when starting fresh with the app. Onboarding is shown only to users who are genuinely new—either first-time guests or users creating a new account.

### What Onboarding Includes

1. **Welcome screens** - Brief introduction to Breadly
2. **Default currency selection** - Primary currency for displaying totals and reports
3. **Secondary currencies selection** (optional) - Additional currencies frequently used
4. **Calendar preference** - Week starts on Monday or Sunday
5. **Additional preferences** (future) - More options may be added

### Default Fallback Values

Since users signing into existing accounts skip onboarding entirely, **every preference set during onboarding must have a sensible default fallback**. This ensures the app works correctly even if a user never completed onboarding.

| Preference           | Default Fallback                                   |
| -------------------- | -------------------------------------------------- |
| Default currency     | USD (or device locale currency if detectable)      |
| Secondary currencies | None                                               |
| Calendar preference  | Monday (or device locale preference if detectable) |

**Why defaults are necessary:** With this simplified approach, a user could sign into an existing account that never went through onboarding (e.g., account created on another device that crashed during setup). While this scenario is rare, the app must handle it gracefully by using defaults.

### When Onboarding is Shown

| Scenario                                      | Onboarding Shown? | Reason                                     |
| --------------------------------------------- | ----------------- | ------------------------------------------ |
| New guest user (first app open)               | ✓ Yes             | First-time user needs to configure basics  |
| New account (first sign-up during onboarding) | ✓ Yes             | New user, continue onboarding after auth   |
| Signing into existing account                 | ✗ No              | Existing account = not a new user          |
| User reinstalls app and signs in              | ✗ No              | Existing account, defaults apply if needed |
| Fresh guest session after sign-out            | ✓ Yes             | Starting fresh as guest                    |

**Key distinction:** The difference between "new account" and "existing account" is determined by whether the user has ever signed in before (Clerk provides this information). Users creating a brand new account see onboarding; users signing into any existing account skip it entirely.

### Storage and Persistence

**Onboarding completion is stored locally on device only.**

- Uses persistent local storage (MMKV)
- Never stored in the database
- Does not sync across devices
- Lost on app reinstall

**Why local-only storage?**

- Simplifies the system (no network checks needed)
- Onboarding is only for genuinely new users anyway
- Existing accounts have preferences already set (or use defaults)
- Reduces sign-in friction—no "Verifying account..." delays

### Preferences Storage by Tier

User preferences (base currency, secondary currencies, week start) are stored differently by tier:

| Preference            | Guest/Free                | Premium             |
| --------------------- | ------------------------- | ------------------- |
| Base currency         | Local database            | Synced table        |
| Secondary currencies  | Local database            | Synced table        |
| Week start (Mon/Sun)  | Local database            | Synced table        |
| Onboarding completion | MMKV (local storage only) | MMKV (never synced) |

**Why this matters:**

- Guest/Free preferences persist across app restarts but are lost on sign-out or app reinstall
- Premium preferences sync across devices
- Onboarding status is always local-only (existing accounts skip onboarding anyway)

### Important Rules

**Onboarding cannot be skipped by new users** - the flow must be completed before accessing the app.

**Existing accounts always skip onboarding** - even if they never completed it. Defaults apply.

**Resumption:** If user closes app during onboarding, they resume from where they left off when reopening.

---

## User Journeys

### 1. First-Time Installation

**"I just installed the app"**

```
User opens app
  ↓
Guest session created
  ↓
Onboarding flow presented
  ↓
User completes onboarding
  ↓
Default categories/accounts created
  ↓
User can track expenses
```

**Key points:**

- No sign-in required initially
- Cannot use app until onboarding complete
- All data stored locally
- Works offline

---

### 2. Signing In as Guest

**"I decided to sign in"** (after already using the app as guest)

**If creating new account:**

```
User taps sign in
  ↓
Authenticates with Google
  ↓
Guest data migrated to new account
  ↓
Onboarding considered complete (guest already did it)
  ↓
Now authenticated free user
```

**Key points:**

- Data is still local-only (no sync yet)
- User can upgrade to premium anytime
- Onboarding already completed as guest, so skipped

**If existing account:**

- See [Signing In to Existing Account](#4-signing-in-to-existing-account)

---

### 3. Signing In Before Using App

**"I decided to sign in before using the app"**

**Creating new account:**

```
App launches → Onboarding welcome screen
  ↓
User taps "Sign in"
  ↓
Authenticates with Google
  ↓
New account detected (first sign-in)
  ↓
Continue with onboarding
  ↓
Complete onboarding
  ↓
Default data seeded
  ↓
Authenticated free user
```

**Key point:** The user is creating a new account, so onboarding continues after authentication.

**Signing into existing account:**

```
App launches → Onboarding welcome screen
  ↓
User taps "Sign in"
  ↓
Authenticates with Google
  ↓
Existing account detected
  ↓
Onboarding skipped entirely
  ↓
Proceed based on subscription status
```

**Key point:** Existing accounts skip onboarding—the user is not new. Defaults apply for any preferences not previously set.

---

### 4. Signing In to Existing Account

#### Account Detection

When signing in, the app needs to determine whether this is a new or existing account. This distinction affects the entire sign-in flow.

**Detection mechanism:** Clerk provides a first-sign-in indicator that tells us whether the user has signed in before. This is available immediately after OAuth completes.

- **New account**: First time signing in with this Google account → show onboarding
- **Existing account**: Returning user → skip onboarding, proceed to app

#### Prerequisites Check (Existing Accounts Only)

Before proceeding, the app verifies:

1. **Legacy data protection check** (requires network)
   - Checks if account has server data (from previous premium subscription)
   - If no server data: Skip blocking, show info toast, proceed with defaults
   - If server data exists: Proceed based on subscription status

**Network failure handling:**

- Shows "Verifying account..." screen
- Retries automatically when connection restored
- Never proceeds without confirmation

**Note:** Onboarding status is NOT checked for existing accounts—they always skip onboarding.

#### With Sync Enabled (Premium)

**Flow:**

```
Sign in → Existing account detected
  ↓
Onboarding skipped + Sync enabled
  ↓
Local guest data cleared
  ↓
Sync download screen appears
  ↓
Cloud data downloads incrementally
  ↓
User can start using app
```

**Local data handling:** Guest data is always cleared when signing into an existing account. No preservation.

**Sync download screen:**

- Modal showing "Downloading your data..."
- Progress indicator visible
- **User can dismiss** - not forced to wait
- Minimized indicator shows ongoing progress
- App is usable during download (partial data visible)
- Data appears incrementally as it downloads

**Edge case - user interaction during download:** If the user creates new data while the download is in progress, PowerSync handles this gracefully. New local changes are queued and will sync normally. There's no conflict because the new data has a different ID than the downloading data.

**Known limitation - potential duplicates in dimension data:**

Creating categories or accounts during initial download could result in UX duplicates:

- User creates "Groceries" category while download in progress
- Download brings existing "Groceries" from cloud
- Result: Two "Groceries" categories with different IDs

**Current approach:** We accept this as a rare edge case. Users can manually delete duplicates. The download screen encourages waiting for completion.

**Future improvement (if needed):** Could temporarily disable creating new categories/accounts until initial hydration completes, or implement name-based deduplication prompts.

#### Without Sync (Free Account)

##### Legacy Data Protection

Before showing blocked screen, app checks for existing server data. This mechanism primarily protects **ex-Premium users** who have cloud data from a previous subscription.

**Does account have server data?**

| Server Data? | Action                                                                |
| ------------ | --------------------------------------------------------------------- |
| No           | Skip blocking, show info toast, proceed with defaults                 |
| Yes          | Show blocked screen (protects ex-Premium data from being overwritten) |

**Definition of "Server Data":** Server data means actual user-created app data, specifically:

- `count(accounts) > 0` OR
- `count(transactions) > 0` OR
- `count(categories) > 0`

A Clerk user record existing (account identity) does NOT count as "server data." This distinction is important: a user who signed up but never used the app should not be blocked.

**When no server data exists:**

- Show informational toast: _"No cloud backup found. Your data is stored locally on your other device."_
- Proceed to app with default data seeded
- User understands their previous data isn't lost—it's just on another device

**Why skip blocking when no server data?**

- No data to protect or conflict with
- Better UX - no unnecessary friction
- Clear communication about where data might be

##### Blocked State Flow

**When shown (server data exists):**

```
Sign in → Existing account detected
  ↓
Onboarding skipped + No sync + Server data exists
  ↓
User blocked with mandatory screen
  ↓
User must choose one option
```

**Available options:**

1. **Purchase subscription**
   - Enables sync
   - Loads cloud data
   - Local guest data already cleared

2. **Delete all server data**
   - Deletes all Breadly data from server
   - **Requires typed confirmation**
   - Clerk identity preserved
   - Onboarding skipped (existing account), defaults apply
   - Default data seeded (categories, accounts)

3. **Sign out**
   - Returns to fresh guest state
   - Must complete onboarding as new guest

**What "Delete all server data" does:**

- Permanently deletes all Breadly data (transactions, categories, accounts, budgets, preferences)
- **Cannot be undone**
- Requires typed confirmation phrase
- Clerk identity remains (same user ID, same Google account)
- RevenueCat linkage preserved
- Other devices not automatically signed out

**Multi-device impact of deletion:**

- Other devices' Clerk sessions remain valid
- Other devices continue working locally
- On next API/sync attempt, they receive "no server data" response
- Each device handles this gracefully

---

### 5. Upgrading to Premium

**"I subscribed to premium"**

```
User completes purchase
  ↓
App switches to cloud sync mode
  ↓
All existing local data uploaded
  ↓
Automatic sync begins
  ↓
Multi-device access enabled
```

---

### 6. Subscription Expiry

**"My subscription expired"**

```
App detects subscription inactive
  ↓
Waits for upload queue to empty (all changes synced)
  ↓
Disconnects PowerSync (keeps data in synced tables)
  ↓
User keeps all data locally
  ↓
Sync capability lost until re-subscription
```

**Key points:**

- All pending changes are synced to server before disconnecting
- **No data migration** — data stays in synced tables, just disconnected
- User keeps all local data (nothing deleted or moved)
- No user confirmation required

**Offline expiry:**

- App continues operating normally
- When network restored, queue drains first
- Only after sync complete does disconnect happen

#### Technical Process (Simplified)

When subscription expires, we simply disconnect PowerSync:

```
Subscription expires
  ↓
Wait for upload queue to be empty (all pending changes synced)
  ↓
Disconnect PowerSync
  ↓
App continues with local data (still in synced tables, just not connected)
```

**Critical rule: Never manually clear the upload queue.**

The user's data must reach the server before disconnecting. This ensures:

1. **No data loss** — All user changes are safely on the server
2. **Clean state** — No orphaned queue entries
3. **Easy re-subscription** — Just reconnect, no migration needed

**Why no schema migration?**

- Data remains in synced tables but PowerSync is simply not connected
- Local reads/writes continue to work (PowerSync SQLite is local)
- When user re-subscribes, we just reconnect — PowerSync handles sync automatically
- Eliminates complex migration logic and potential failure points

**What if the user is offline?**

- App continues working normally
- Changes queue locally (in synced tables)
- When network is restored, queue drains first
- Only after queue is empty does disconnect happen
- User sees "Syncing your data..." indicator

**Multi-device behavior:**

- Each device disconnects independently when detecting expiry
- No coordination between devices
- Each keeps its data locally (still in synced tables)

**Device coming back online after expiry:**

When a device was offline during subscription expiry and comes back online:

1. **Verify entitlement first** — Check subscription status
2. **If not entitled** → Allow sync to continue temporarily (upload queue must drain)
3. **Wait for upload queue to empty** — All offline changes reach the server
4. **Disconnect PowerSync** — User can continue with local data

**Why this order matters:**

- All user data reaches the server before losing sync capability
- No data created while offline is lost
- Clean disconnect without orphaned queue entries

---

### 7. Re-subscribing After Expiry

**"I re-subscribed after my subscription expired"**

```
User purchases new subscription
  ↓
App reconnects PowerSync
  ↓
Upload queue drains (local changes sync to server)
  ↓
Server changes download (if any from other devices)
  ↓
PowerSync merges automatically (last write wins)
  ↓
User is fully synced again
```

**Key points:**

- **No user prompt needed** — PowerSync handles merge automatically
- Data stayed in synced tables during expiry, so no migration required
- Any changes made while expired are queued and sync up on reconnect
- Conflicts resolved automatically using PowerSync's "last write wins" per-field

**What happens to offline changes?**

Changes made while subscription was expired:

- Were stored locally in the synced tables
- Were queued in the upload queue (but couldn't upload without connection)
- Sync up automatically when PowerSync reconnects

**Multi-device scenario:**

If multiple devices were used while expired:

- Each device reconnects independently
- Each device's queued changes sync to server
- PowerSync merges using "last write wins" per-field
- Result: most recent change to each field wins

**Why no conflict prompt?**

We previously considered showing a "keep local vs keep cloud" choice, but:

- Adds complexity for a rare edge case
- PowerSync's automatic merge handles most scenarios gracefully
- Users who made changes while expired generally want those changes preserved
- "Last write wins" is intuitive — most recent change is kept

---

### 8. Signing Out

Sign-out flow includes safeguards to prevent accidental data loss.

#### Premium Users (with pending uploads)

```
User taps sign out
  ↓
Check for pending data
  ↓
If pending exists:
  ├─→ Show waiting screen: "Uploading X of Y transactions..."
  ├─→ User can wait (safe sign-out)
  └─→ OR immediate sign-out with typed confirmation
```

**Immediate sign-out confirmation:**

- Upload queue cleared
- Only unsynced data lost
- Data already on server is safe

#### Authenticated Free Users

**Always show warning** (no cloud backup exists):

```
User taps sign out
  ↓
Destructive action warning shown
  ↓
"All your data will be permanently deleted"
  ↓
Must type confirmation phrase
  ↓
Local data cleared
  ↓
Fresh guest session created
  ↓
Onboarding shown
```

#### Premium Users (no pending uploads)

```
User taps sign out
  ↓
Sign-out proceeds
  ↓
Local data cleared
  ↓
Fresh guest session created
  ↓
Onboarding shown
```

**Note:** Cloud data remains safe on server. User can sign back in to restore it.

#### Network Failure During Sign-Out

```
Network unavailable
  ↓
Warning: "Cannot upload unsynced data"
  ↓
User can choose:
  ├─→ Wait for network
  └─→ Sign out anyway (typed confirmation required)
```

**Implementation note:** All confirmations and warnings handled at UI layer **before** sign-out event dispatched to state machine.

---

### 9. Account Deletion

**"I want to delete my account"**

```
User initiates deletion (from settings)
  ↓
Confirmation dialog shown
  ├─→ Explains permanent deletion
  ├─→ Advises canceling subscription if active
  └─→ States cannot be undone
  ↓
User types confirmation phrase
  ↓
Backend deletes all user data
  ↓
Clerk account deleted
  ↓
User signed out → fresh guest state
  ↓
Onboarding shown
```

**Subscription handling:**

- Confirmation explicitly advises canceling subscription
- App cannot programmatically cancel subscriptions
- User must cancel through App Store/Play Store
- RevenueCat continues billing until manually canceled

**Multi-device impact:**

- Device B receives auth error on next sync
- Automatically signed out

---

### 10. Reinstalling App

**"I reinstalled the app (while premium)"**

```
User reinstalls app
  ↓
Fresh guest session created
  ↓
Onboarding welcome screen shown
  ↓
User taps "Sign in"
  ↓
Authenticates with Google
  ↓
Existing account detected
  ↓
Onboarding skipped (existing account)
  ↓
Active subscription detected
  ↓
Sync download screen appears
  ↓
Cloud data downloads
  ↓
User sees data as it downloads
```

**Key points:**

- Onboarding starts but is skipped once existing account is detected
- Only cloud-synced data survives (local data was never preserved)
- Preferences use defaults if not previously set

---

## Guest Data Warning

### Overview

Guest users are repeatedly reminded that their data is not backed up and could be lost. This ensures users understand the risk of not authenticating.

### When Warning is Shown

**Persistent reminder in settings/profile area:**

> "Your data is only on this device. Sign in to protect your data."

**Periodic reminder (e.g., after adding 5+ transactions):**

> "You have X transactions that aren't backed up. Sign in to keep your data safe."

**Before destructive actions (if guest):**

- Shown before any action that could lead to data loss
- Clear explanation that guest data is local-only

### Why No Data Preservation

When a guest signs into an **existing** account, their local guest data is **always cleared**. There is no backup or restoration mechanism.

**Rationale:**

- Users are warned repeatedly about the risk of not signing in
- Signing into an existing account is a clear user choice
- If they picked the wrong account, they can sign out (but data is lost)
- This scenario is rare: most users sign into new accounts, not existing ones

**Documentation for support:** If a user reports losing data when signing into an existing account, this is by design. They were warned repeatedly. Support documentation should note: "Guest data is cleared when signing into an existing account. The app warned you to sign in before this happened."

---

## Sync Behavior

### Data Storage Model

Breadly uses PowerSync for data synchronization. Understanding the table types is essential:

### Table Types

**Synced Tables** (Premium users only):

- Replicated between device and cloud
- Changes queued in upload queue for sync
- Persisted locally and backed up to server
- Examples: transactions, accounts, categories, preferences

**Local-Only Tables** (All users):

- Stored locally and **durable on device** (persists across app restarts)
- Never placed in the upload queue, never synced to server
- Examples: currencies (read-only reference data)

**Important distinction:** "Local-only" in PowerSync means "not synced," NOT "ephemeral" or "cleared on restart."

### Clearing Rules (Breadly-Specific)

We explicitly clear local data in these situations:

| Trigger                                      | What Gets Cleared      | Reason                                      |
| -------------------------------------------- | ---------------------- | ------------------------------------------- |
| Sign into existing account                   | All local guest data   | Cloud data takes precedence                 |
| Sign out (any user)                          | All local data         | Fresh guest session                         |
| Delete server data (blocked state)           | Nothing cleared        | Server wiped, fresh start with local schema |
| Subscription expires                         | Nothing cleared        | PowerSync disconnected, data stays in place |
| Schema switch (local → synced after upgrade) | Local-only user tables | Data migrated to synced tables              |

---

## What Cloud Sync Means

When premium is active:

- Real-time connection to backend maintained
- Local changes queued and uploaded automatically
- Backend changes pulled down automatically
- Seamless offline usage (syncs when back online)

### Offline Behavior (Premium Users)

```
User goes offline
  ↓
App continues working normally
  ↓
Changes queued locally
  ↓
Connection restored
  ↓
Changes sync automatically
```

No user action required.

### Network Failure During Sign-In

**Scenario:** User signs in, network unavailable

```
Sign-in initiated
  ↓
Network unavailable
  ↓
Cannot determine subscription status
  ↓
Loading/retry screen shown
  ↓
Retries automatically when connection restored
  ↓
User cannot proceed until status confirmed
```

**Why block?**

- Incorrectly assuming sync status leads to wrong data handling
- Must wait for definitive answer

**Partial network failure:**

- Clerk sign-in succeeds
- Network drops before RevenueCat verification
- User authenticated but subscription status unknown
- Shows "Verifying subscription..." screen
- Retries automatically
- User cannot proceed until verified

**Timeout handling:**

- After 30 seconds, show "Retry" button
- User can cancel and return to guest (data preserved)
- Background retry continues

### Conflict Resolution

PowerSync uses **last write wins** conflict resolution with these specifics:

**How it works:**

- Resolution is **per-field**, not per-record (editing different fields on same record = both changes kept)
- "Last write" is determined by **when the server receives the update**, not client-side timestamps
- **Deletes always win** — if one device deletes a record while another edits it, the delete takes precedence
- Handled automatically by PowerSync — users never see conflict prompts

**Practical implications:**

- Different transactions on devices → both kept (no conflict)
- Same transaction, different fields edited → both field changes kept
- Same transaction, same field edited → last update received by server wins
- One device deletes, another edits → delete wins

### Exchange Rates and Multi-Currency

Multi-currency support in Breadly has two distinct components:

| Feature                             | Guest/Free | Premium |
| ----------------------------------- | ---------- | ------- |
| Create transactions in any currency | ✓          | ✓       |
| Set a base (home) currency          | ✓          | ✓       |
| View transactions per currency      | ✓          | ✓       |
| Converted totals in base currency   | ✗          | ✓       |
| Exchange rate data                  | ✗          | ✓       |

#### Currencies (All Users)

- Access to full currency list (all ISO currencies)
- Currencies stored in read-only reference table
- Populated on first app open from `currency-codes` library
- Premium users switch to synced currencies table for cross-device consistency

#### Exchange Rates (Premium Only)

- Exchange rates synced from server via PowerSync
- Enables automatic currency conversion (totals displayed in base currency)
- Updated regularly from external rate provider

**Conversion policy:**

- **Rate used:** Rate at the time of viewing (latest available rate)
- **Why not rate-at-transaction-time?** Simpler implementation, consistent totals, and users care more about current portfolio value than historical accuracy
- **Stale rates:** If rates are older than 24 hours, show "Rates updated X hours ago" indicator

**Offline behavior (Premium users):**

- Use cached rates (last synced)
- Show indicator: _"Using cached rates from [date]"_
- If no cached rates exist (rare - first install offline), show amounts per currency without conversion
- Never block the user or show errors - graceful degradation

#### Guest/Free Currency Experience

- Can create transactions in any currency
- **Cannot** see converted totals — amounts displayed separately per currency
- Shows a clear upgrade prompt: _"Upgrade to Breadly Premium to see converted totals in your base currency."_

**Why this distinction?** Multi-currency transactions are valuable for all users (travelers, international users). Currency _conversion_ requires server-side rate data and ongoing maintenance, making it a natural Premium feature.

#### Budgets and Currency

Budgets follow a simple currency model:

- **Budgets are always in one currency (the user's base currency)**
- Transactions in other currencies are converted using current exchange rates for budget tracking
- Guest/Free users: Budgets only track transactions in the base currency (no conversion available)
- Premium users: All transactions contribute to budgets via automatic conversion

**Why base currency only?**

- Simplifies budget management (one number to track)
- Avoids confusion about "which currency is this budget in?"
- Consistent with how users think about budgets (monthly limit in their home currency)

**Guest/Free limitation:** Since they don't have exchange rates, transactions in non-base currencies don't count toward budgets. A clear message explains: _"This transaction is in [currency] and won't be included in your budget totals. Upgrade to Premium to track all currencies."_

---

## Multi-Device Behavior

### Signing In on New Device

```
User signs in on Device B
  ↓
Sync download screen appears
  ↓
Downloads all cloud data
  ↓
User can dismiss modal
  ↓
Both devices show same data
  ↓
Changes sync between devices
```

### Signing Out on One Device

```
Sign out on Device A
  ↓
Device A → guest state
  ↓
Device B unaffected
  ↓
Device B remains synced and functional
  ↓
Cloud data not deleted
```

### Device Conflict Scenarios

Same data modified on two offline devices:

- Last write wins (based on when server receives the update)
- Handled automatically by PowerSync
- No manual conflict resolution shown

### Free Users on Multiple Devices

**Behavior:**

- Can technically sign in on multiple devices
- Each device has independent local data
- Data diverges over time
- Acceptable behavior without sync

**Sign-in flow:**

- If server data exists → blocked state
- If no server data → legacy data protection skips blocking, shows info toast
- Must subscribe, delete server data, or sign out

**User communication:**
Blocked screen explains: "You have data stored on this account that requires a subscription to access."

### Free User Re-Sign-In (Same Device)

```
Free user signs out
  ↓
Local data cleared (with confirmation)
  ↓
Now guest
  ↓
Signs back in to same account
  ↓
Existing account without sync → blocked
  ↓
Same options as new device sign-in
```

**Why?** App cannot distinguish "same device, temporary sign-out" from "different device." Without sync, cannot restore pre-sign-out data.

**Key takeaway:** Free users should avoid signing out - no benefit, data will be lost.

---

## Data Safety Principles

Breadly follows these principles to protect user data:

1. **No silent data loss** — Data is never deleted without the user being informed
2. **Destructive actions require explicit confirmation** — Any action that permanently removes data requires typed confirmation
3. **Replacement choices are clearly explained** — When choosing between datasets (local vs cloud), we explain which data wins and what will be lost

**Note:** These are design principles, not absolute guarantees. Intentional data clearing (e.g., signing into an existing account clears guest data) is expected behavior that users are warned about in advance.

| Scenario                                   | Data Handling                                               |
| ------------------------------------------ | ----------------------------------------------------------- |
| New guest user opens app                   | Must complete onboarding                                    |
| Guest signs in (new account)               | Data migrated, onboarding already complete as guest         |
| Fresh sign-up (no guest data)              | Onboarding required (new account), default data seeded      |
| Sign-in to existing account                | Onboarding skipped, local data cleared, defaults apply      |
| Guest → existing (sync enabled)            | Local data cleared, cloud data shown                        |
| Guest → existing (no sync, no server data) | Legacy protection skipped, info toast shown, defaults apply |
| Guest → existing (no sync, blocked)        | Local data cleared, 3 options shown                         |
| Free user upgrades                         | Local data uploaded to cloud                                |
| Premium downgrades                         | Queue drains, PowerSync disconnects, data stays in place    |
| Re-subscribe after expiry                  | PowerSync reconnects, automatic merge (last write wins)     |
| Sign out (any user)                        | Fresh guest session, onboarding shown                       |
| Sign out (pending data, Premium)           | Wait for sync OR confirm loss, then fresh guest             |
| Auth Free signs out                        | Warning + typed confirmation, fresh guest                   |
| Network failure during sign-out            | User warned, wait or proceed with confirmation              |
| Sign back in (premium)                     | Cloud data restored                                         |
| Purchase from blocked state                | Cloud data loaded                                           |
| Delete server data                         | Server deleted, identity preserved, defaults apply          |
| Sign out from blocked state                | Fresh guest session                                         |
| Network failure during sign-in             | Blocks until connection restored                            |
| App reinstalled (premium)                  | Cloud data restored after sign-in                           |
| App crashed during sync                    | State machine recovers and resumes                          |
| Subscription expires                       | Wait for queue to drain, then disconnect PowerSync          |
| Sign out on Device A (Device B synced)     | Device A → fresh guest, Device B unaffected                 |
| Account deleted on Device A                | Device B gets auth error, auto sign-out to fresh guest      |
| Migration fails midway                     | Error state with retry, idempotent                          |
| Subscription expires offline               | Queue drains when online, then disconnect PowerSync         |
| Sign-in succeeds, verification fails       | Verification screen, waits for network                      |
| Concurrent sign-in (multi-device)          | Each handles independently                                  |

---

## User Education and Support

### In-App Education

**Settings messaging (guest/free users):**

> "Not signed in – your data is only on this device. Sign in and upgrade to back up your data in the cloud."

**Subscription expiry notification:**

> "Sync has been disabled because your subscription ended. Don't worry, your data is still on this device. Renew your subscription to continue syncing."

**Account status indicator:**

- Visual indicator showing sync status
- Cloud icon with checkmark (synced users)
- Cloud with slash (local-only users)
- Tapping explains status
- For premium: show "last synced" timestamp or "All changes backed up"

**Persistent backup warning for Free/Guest users:**

Free and Guest users should see a **persistent, non-dismissible indicator** (not just during onboarding) that reminds them their data is not backed up:

- Display a "cloud slashed" icon in the dashboard header or settings
- Tapping shows: _"You are signed in, but your data is NOT backed up to the cloud. Upgrade to Premium to enable cloud backup."_
- For guests: _"Your data is only on this device. Sign in and upgrade to protect your data."_

**Why persistent?** Users forget onboarding warnings immediately. A visual reminder prevents the common misconception that "signed in = data is saved."

**Multi-currency limitation (free/guest):**

> "Upgrade to Breadly Premium to see converted totals in your base currency."

### UI Messaging Guidelines

#### Sign-Out Warnings

**Free users:**

> "I understand that all my data will be permanently lost"
>
> "All your data will be permanently deleted. You have no cloud backup."

**Premium users (unsynced data):**

> "I understand X changes will be lost"
>
> "You have unsynced data. Without network, this data will be lost if you sign out now."
>
> "You have X unsynced transactions. These will be lost if you sign out now."

#### Blocked State Screen

**Main message:**

> "You have data stored on this account that requires a subscription to access."

**Purchase option:**

> "Subscribe to enable sync and access your data"
>
> Explain: loads cloud data, discards local data
>
> Show: information about server data amount if possible

**Delete server data option:**

> "Delete all server data and start from scratch"
>
> Explain: deletes all server data, keeps account identity, starts fresh with default preferences, can use local data if available, allows fresh start while keeping account

**Sign out option:**

> "Sign out and start fresh"
>
> Explain: returns to fresh guest mode, local data is cleared

---

## Decision Log

This section documents **why** certain decisions were made.

### Why no data preservation when signing into existing account?

**Decision:** Always clear local guest data when signing into an existing account. No backup or restoration mechanism.

**Rationale:**

- Users are warned repeatedly to sign in before using the app extensively
- Signing into an existing account is a deliberate user choice
- If they picked the wrong account, they can sign out (data is lost, but they were warned)
- This scenario is rare: most users sign into new accounts, not existing ones
- Sign-out always results in fresh guest state (simple, predictable)

---

### Why "last write wins" instead of conflict resolution UI?

**Decision:** Use automatic "last write wins" conflict resolution.

**Rationale:**

- Most users won't understand conflict resolution UI
- PowerSync handles automatically
- Worst case: user redoes a transaction (minor inconvenience)
- Simpler UX - no confusing prompts
- Per-field resolution means different edits to same record don't conflict

---

### Why block free users on second device?

**Decision:** Show blocked screen when free user signs into existing account on new device (if server data exists).

**Rationale:**

- Multi-device access requires sync to prevent data divergence
- Without sync, multiple devices create divergent data sets
- Complex to merge if user later subscribes
- Encourages subscription for multi-device use
- Protects data integrity

---

### Why show onboarding only for new users (guests and new accounts)?

**Decision:** Show onboarding only for first-time guests and users creating new accounts. Skip onboarding entirely for existing accounts.

**Rationale:**

- Simplifies the system—no need to track onboarding completion in database
- Existing accounts are not new users—they shouldn't see onboarding
- Reduces sign-in friction (no network checks for onboarding status)
- Default fallbacks ensure app works even without onboarding
- Local-only storage for onboarding completion is sufficient

---

### Why store onboarding completion locally only?

**Decision:** Store onboarding completion status in local persistent storage (MMKV), never in the database.

**Rationale:**

- Onboarding is only relevant for genuinely new users
- Existing accounts skip onboarding regardless of completion status
- No need for network verification—simplifies sign-in flow
- Default fallback values handle the rare case of missing preferences
- Reduces complexity and improves reliability

---

### Why require default fallbacks for all onboarding values?

**Decision:** Every preference set during onboarding must have a sensible default fallback.

**Rationale:**

- Existing accounts skip onboarding—they may never have set preferences
- Edge case: user creates account, app crashes before onboarding completes
- Another device signs into the account—preferences may be missing
- App must work correctly without any onboarding-set values
- Defaults based on device locale provide good UX

---

### Why use legacy data protection instead of always blocking?

**Decision:** Check for server data before showing blocked screen; skip if no data exists.

**Rationale:**

- This mechanism primarily protects **ex-Premium users** from accidentally losing cloud data
- For "forever free" users on a new device, no server data exists—blocking would be confusing
- When skipping, show info toast: _"No cloud backup found. Your data is on your other device."_
- Better UX: no friction for abandoned accounts (no data)
- Reduces confusion: "Delete all server data" confusing when none exists
- Fail-safe: network failure defaults to blocked screen (safe path)

---

### Why check only server data (not active sessions)?

**Decision:** Use server data presence (not active sessions) for legacy data protection.

**Rationale:**

- Clerk sessions are JWT-based, appear "active" until expiration (~1 hour)
- False positives: blocks users who simply used another device yesterday
- Server data is reliable indicator: if no data, nothing to protect
- Multi-device free users have independent local data (acceptable, documented behavior)

---

### Why define "Server Data" as app data, not account existence?

**Decision:** "Server Data" means `count(accounts) > 0 OR count(transactions) > 0 OR count(categories) > 0`, not merely that a Clerk user record exists.

**Rationale:**

- A user who signed up but never used the app has nothing to protect
- Blocking them would be unnecessary friction
- The goal is to protect user-created data, not identity records
- This allows seamless re-sign-in for abandoned accounts

---

### Why disconnect PowerSync instead of migrating to local-only tables on expiry?

**Decision:** When subscription expires, simply disconnect PowerSync rather than migrating data from synced tables to local-only tables.

**Rationale:**

- **Eliminates complex migration logic** — No need to copy data between table types
- **Simpler re-subscription** — Just reconnect PowerSync, no migration needed
- **Less error-prone** — Schema migrations can fail; disconnect/reconnect is simple
- **PowerSync handles it** — Local SQLite works fine while disconnected
- **Automatic merge on reconnect** — PowerSync's "last write wins" handles any conflicts

**Trade-off acknowledged:** We lose the ability to offer users a "keep local vs keep cloud" choice on re-subscription. PowerSync merges automatically. We accept this because:

- The conflict scenario is rare (user must make changes while expired AND another device must also make changes)
- "Last write wins" is intuitive behavior
- The simplification significantly reduces code complexity and potential failure points

---

### Why no conflict prompt on re-subscription?

**Decision:** When a user re-subscribes after expiry, PowerSync reconnects and merges automatically without prompting the user to choose between local and cloud data.

**Rationale:**

- Data never left synced tables — just disconnected
- PowerSync's automatic merge handles most scenarios gracefully
- "Last write wins" per-field means both devices' changes can coexist (different fields)
- Users who made changes while expired generally want those changes preserved
- Eliminates complex conflict resolution UI and backend RPC
- Rare edge case doesn't justify the added complexity

---

### Why use latest exchange rate instead of rate-at-transaction-time?

**Decision:** Currency conversion uses the latest available exchange rate, not the rate at the time the transaction was created.

**Rationale:**

- **Simpler implementation** — No need to store historical rates or rate snapshots per transaction
- **Consistent totals** — All amounts convert using the same rate, making totals intuitive
- **User mental model** — Users typically want to know "what is my spending worth today?" not "what was it worth when I spent it?"
- **Storage efficiency** — Storing rate-at-time for every transaction adds significant data overhead

**Trade-off acknowledged:** Historical reporting may show different totals when viewed at different times. We accept this because:

- Personal finance apps prioritize current portfolio value
- Accounting-grade historical accuracy is not our target use case
- Users can still see original amounts in the transaction's native currency

---

### Why use a single schema instead of separate local-only and synced tables?

**Decision:** All users (Guest, Free, Premium) write to the same table schema. Premium users have PowerSync connected; others don't.

**Rationale:**

- **No migration logic** — Upgrade/expiry just connects/disconnects PowerSync
- **One codebase** — Same queries, same data access patterns for all tiers
- **Simpler testing** — One set of tables to test, not two
- **No data movement** — Data never copied between table types
- **PowerSync works offline** — Synced tables function normally without connection

**Alternative considered:** Separate local-only tables for Guest/Free and synced tables for Premium, with migration on upgrade/expiry.

**Why rejected:**

- Migration adds complexity and failure points
- Expiry migration risks data loss (overwrite existing local data)
- Multi-device re-subscribe becomes complex (which device's data wins?)
- More code to maintain
