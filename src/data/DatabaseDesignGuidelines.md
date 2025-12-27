# Designing a PostgreSQL + PowerSync Schema for Offline-First Apps

**Local-First Personal Finance App Example**

---

## 1. Server-Side Features to Avoid or Limit

When using PostgreSQL on the server and PowerSync (with SQLite/JSON views) on the client, be cautious with advanced server-side features that won't run on the client. In an offline-first scenario, the client's local database can't enforce the same constraints or triggers, so heavy reliance on those features can lead to inconsistencies until sync. Key points to consider:

### Foreign Keys & Cascading Actions

PostgreSQL supports foreign key constraints with `ON DELETE CASCADE` (and similar), but the default PowerSync client uses schemaless JSON storage and does not enforce foreign keys or cascades locally.

- **Example:** Deleting an Account on the server could cascade-delete its Transactions, but if a user deletes an Account offline, the related Transactions will remain (orphaned) until sync.
- **Pitfall:** Orphaned records or broken references offline can confuse users or app logic.

### Triggers and Server-Side Logic

Triggers (and server functions) can implement business rules (e.g., updating an account's balance after a new transaction), but these triggers won't fire on the client.

- **Example:** If a PostgreSQL trigger maintains an `Account.balance`, an offline client adding a transaction won't trigger that update.
- **Recommendation:** Either avoid complex trigger logic or replicate it in the client application logic.

### Complex Constraints (Unique, Check, etc.)

Client-side JSON views don't enforce constraints beyond basic not-null.

- **Example:** A user might create two categories with the same name offline, despite a server-side unique constraint.
- **Guidance:** Minimize tight or cross-table constraints that can't be enforced on the client. Mirror them in the UI/app logic.

### Heavy Use of Server-Side Joins or Computed Views

These don't sync to the client.

- **Example:** Aggregates like spending per category should be computed on the client or app layer.
- **Recommendation:** Favor eventual consistency and compute locally when needed.

> **Key Point:** Server constraints are your final safety net, not your first line of defense. Treat the client as semi-trusted and enforce important rules via the app.

---

## 2. Mirroring vs. Simplifying the Local Schema

Strike a balance between mirroring the PostgreSQL schema and simplifying it for offline needs:

### Same Tables and Columns (Where Needed)

Define the same core tables (accounts, transactions, categories, etc.) on both server and client.

- PowerSync creates a JSON-backed table (e.g., `ps_data_accounts`) and a view (`accounts`) that exposes structured fields. Matching names and fields makes sync and querying straightforward.

### Intentional Simplifications

- Omit audit logs, admin-only fields, or rarely used columns on the client.
- Exclude tables that aren't needed offline (e.g., server logs).
- The client won't see or use those fields unless defined in the view.

### Normalize vs. Denormalize

- Keep the same relational structure for core data.
- SQLite can handle joins, and PowerSync views support indexes on frequently queried fields.
- Avoid duplicating too much data in JSON to prevent sync complexity.

### Client-Only Data

- Define local-only tables for things like UI state, recently viewed items, or unsynced drafts.
- These don't exist in Postgres and are not synced.

> **Key Point:** Mirror the core structure for easy bi-directional sync. Omit what isn't needed offline to simplify the app and improve performance.

---

## 3. Maintaining Data Integrity, Validation & Consistency

Balance server-side enforcement with client-side proactive validation:

### Server as Source of Truth (Eventual Consistency)

- Enforce all final constraints on PostgreSQL (foreign keys, uniqueness, business rules).
- Accept that temporary inconsistencies can occur offline.

### Client-Side Validation and Business Rules

- Validate input in the UI (e.g., no negative amounts, unique category names).
- Prevent constraint violations before sync by replicating checks in app logic.

### Handling Sync Conflicts and Errors

- **Automatic Resolution:** Server silently discards or adjusts bad writes.
- **Error Propagation:** Return a 2XX response with a message instead of a sync-breaking error. Optionally store in a `sync_errors` table.
- **Manual Merge:** In rare cases, let the user resolve a conflict (e.g., two edits to the same transaction from different devices).

### Consistency for Free (Local-Only) Users

- Enforce full rules in the client since there's no server to catch mistakes.
- Don't allow data corruption (e.g., orphaned records) through UI workflows.

### Testing Offline Scenarios

- Simulate multi-device edits, long periods offline, or deletes with children.
- Use this testing to fine-tune what to validate in the app vs. the backend.

> **Key Point:** Clients must be proactive in enforcing rules through app logic. The server catches edge cases and resolves conflicts, but the goal is to prevent them altogether.

---

## 4. PowerSync Best Practices for Offline-First Architecture

To make PowerSync work reliably in production, follow these best practices:

### Use Globally Unique IDs

- Use UUIDs or cuid strings instead of serial integer IDs.
- Prevents ID collisions when multiple devices create records offline.

### Design for Partial Sync (Data Partitioning)

- Each table should include a `user_id` or similar identifier.
- Use Sync Buckets to filter data per user/device.
- Shared global data (e.g., currency types) can use a global bucket.

### Keep Schemas Consistent Across Platforms

- Ensure table and column names match exactly between server and client schema definitions.
- PowerSync maps synced JSON to views based on these names.

### Plan for Migrations

- Add/remove columns carefully, accounting for clients that haven't updated yet.
- The PowerSync client stores schema state in a `ps_migrations` table.
- Default values and nullable fields help during transition.

### Leverage Upload Hooks for Business Logic

- Validate user permissions, set timestamps, or enrich data before writing to Postgres.
- Don't return hard 4XX errors for data issues—gracefully handle and log instead.

### Conflict Resolution Strategy

- **Default:** Last-write-wins (server's perspective).
- For important data, consider per-field timestamps or user review flows.
- Log conflicts for audit/debugging.

### Optimizing Client Queries

- Avoid large joins or full-table scans in SQLite over JSON views.
- Add indexes to frequently filtered columns (e.g., date, `category_id`).
- Use local caches for computed values when needed.

### Security Considerations

- Don't sync sensitive or server-only data unless necessary.
- Use RLS (Row-Level Security) in Postgres and sync filters in PowerSync to isolate user data.

### Optional Sync and Upgrade Path

- Ensure users upgrading from free → paid don't hit constraint errors when first syncing.
- Test bulk uploads of client data on first sync.
- Use unique IDs and per-user scoping to avoid collisions.

### Monitoring and Logging

- Implement logging around upload API endpoints.
- Track inserts, failures, conflicts, and schema mismatch errors.
- Helps debug sync issues and monitor app health.

> **Key Point:** Sync works best when your app respects PowerSync's schema rules, uses unique identifiers, and treats the server as a reconciliation authority—while making the client robust and smart on its own.

---

## 5. Using ON DELETE CASCADE in Local-First PowerSync Apps

It's perfectly reasonable to use `ON DELETE CASCADE` in your PostgreSQL schema to keep the server's data consistent, but you shouldn't rely on it to do all the work in a local-first setup. In PowerSync, the client database is a SQLite view over JSON; there are no native foreign keys or cascading deletes, so deleting a parent locally will not automatically delete its children. The server, however, can safely enforce referential integrity and cascade deletes as usual. To make this work smoothly with PowerSync, you need to design both sides accordingly:

### Why Cascades Are Useful on the Server

- Cascading deletes maintain referential integrity: if you delete an account row in a finance app, the database automatically deletes the associated transactions and budget_categories rows. When the PowerSync client next syncs, it will see that the child rows are gone and remove them locally. This ensures all devices end up with a consistent, clean state.
- Server-side triggers and cascades can still enforce business rules (updating balances, rejecting deletes when there is a non-zero balance, etc.). These rules are not run on the client, but they guarantee the final state on the server is correct and that invalid operations are rejected.

### Things to Avoid

- **Don't expect cascades to work locally.** Because the client tables are JSON views, SQLite's foreign keys, constraints, or triggers don't run.

  If you need children to disappear immediately in the UI, you'll either:
  - (a) delete them explicitly in the same transaction when the parent is deleted, or
  - (b) create your own triggers on PowerSync's internal tables.

  Otherwise, they'll remain until the next sync.

- **Don't treat a "row not found" response as a hard error.** The PowerSync client will retry failed mutations, and if the server returns a 4xx error, the upload queue will block.

  Instead, return a 2xx status even for cases like validation or conflict (and optionally log or sync the error details separately).

### Make Deletion Idempotent

PowerSync's backend API may receive the same operation more than once or receive operations out of order. The documentation stresses that all operations must be idempotent. That is, a second DELETE for a row that's already gone should simply be ignored. Your deletion endpoint should therefore:

1. Accept a DELETE request for a row even if it has already been removed (by an earlier cascade or an offline client). Treat it as a no-op rather than an error.
2. Return a 2xx status for such "repeat" deletes and optionally log the fact that the row wasn't found. Do not return a 4xx, because that blocks the client's upload queue.
3. Use the per-operation sequence number included with each PowerSync write to deduplicate if needed.

In practice this means that if your React Native client manually deletes a set of transactions after a user deletes an account, the server should ignore each DELETE that no longer has a matching row and return success. Alternatively, adjust your client logic so that it doesn't attempt to delete children when you intend to rely on `ON DELETE CASCADE` on the server—just delete the account, and let the server cascade handle the rest. When the server processes the deletion and cascades child deletions, PowerSync will sync those changes down and remove the orphaned rows from all devices.

### Consider Soft Deletes for Smoother UX

Another pattern used in offline-first apps is to avoid physical deletes altogether. Instead of deleting rows, add a `deleted_at` column and mark records as deleted.

- Cascading can then be emulated by a trigger that marks children as deleted when the parent is marked.
- This avoids "not found" errors entirely and lets clients hide deleted records immediately.
- You can periodically purge rows marked as deleted on the server when you're sure all devices have synced the deletion.

### Client-Side Strategies

- If immediate removal of child rows is important (e.g., transactions should vanish from the ledger as soon as the account is deleted), perform both deletes in a single local transaction.

  The cascading delete tutorial shows how to do this by deleting child rows and then the parent within a single `writeTransaction()`.

  When the server later cascades the same deletions, the idempotent delete logic will see that they are already gone and ignore them.

- Avoid experimenting with raw SQLite tables for cascades unless you need strict foreign-key constraints; raw tables require `DEFERRABLE INITIALLY DEFERRED` foreign keys and careful ordering of streamed changes, so they're considered advanced and experimental.

### Summary

Using `ON DELETE CASCADE` on your PostgreSQL server is fine for an offline-first PowerSync app, but the cascade logic only runs on the server.

On the client, you must delete related rows manually if you need immediate consistency, and ensure that your backend deletion handlers are idempotent—delete requests for already-deleted rows should be treated as successful rather than errors.

When the server processes a deletion and cascades child deletions, PowerSync will sync those changes back, and the client's local SQLite database will match the server state.

---

## 6. Date and Timestamp Handling

Proper date handling is critical for offline-first applications. Different timezone handling between timestamps and date-only fields prevents data corruption during sync.

### Two Types of Date Fields

| Type           | Examples                                  | Storage             | Timezone              |
| -------------- | ----------------------------------------- | ------------------- | --------------------- |
| **Timestamps** | `created_at`, `updated_at`, `archived_at` | ISO 8601 with time  | UTC (timezone-aware)  |
| **Date-only**  | `tx_date`, `start_date`, `due_date`       | `YYYY-MM-DD` string | Local (calendar date) |

### Timestamps (Timezone-Aware)

Timestamps represent exact moments in time and should be stored in UTC.

```typescript
// ✅ Correct - Timestamps use UTC
const createdAt = new Date() // Current moment
// Stored as: '2024-12-25 10:30:00.000Z'
```

**How it works:**

1. Client creates timestamp with `new Date()`
2. Custom Drizzle type converts to ISO 8601 string (UTC)
3. PowerSync syncs the string to server
4. Server parses back to Date object

**Safe operations:**

- `new Date()` - creates current timestamp
- `.toISOString()` - always produces UTC (safe for timestamps)
- Standard date-fns functions work correctly

### Date-Only Fields (Calendar Dates)

Date-only fields represent calendar dates without time (e.g., "December 25, 2024"). The user's intent is to record a specific calendar day, regardless of timezone.

```typescript
// ✅ Correct - Use helper functions for date-only fields
import { createLocalDate, toDateString } from '@/lib/utils'
import { startOfToday, addDays, isToday } from 'date-fns'

const txDate = createLocalDate(2024, 12, 25) // Dec 25, 2024 (1-indexed month)
const today = startOfToday() // Today's date at midnight local time
const tomorrow = addDays(startOfToday(), 1)
const dateStr = toDateString(txDate) // '2024-12-25'
if (isToday(txDate)) { ... }

// ❌ WRONG - May shift the date!
const wrong = txDate.toISOString().split('T')[0]
// If user is in UTC+12 at midnight Dec 25:
// toISOString() returns '2024-12-24T12:00:00.000Z'
// split('T')[0] gives '2024-12-24' - SHIFTED!
```

**How it works:**

1. Client stores date as `YYYY-MM-DD` string in SQLite
2. PowerSync syncs the **raw string** (not the Date object)
3. Server receives string and parses at UTC midnight for Postgres
4. Round-trip preserves the exact date string

**Critical Rule:** Never use `.toISOString()` on date-only Date objects. It converts to UTC which may shift the calendar date.

### Offline Sync Safety

Date-only strings are inherently safe for offline sync:

1. User creates transaction on Dec 25 → stored as `'2024-12-25'`
2. User goes offline for 3 days
3. Sync happens on Dec 28 → PowerSync syncs `'2024-12-25'` string
4. Server receives `'2024-12-25'` → stores in Postgres date column
5. Date is preserved because **the string is the source of truth**

### Available Helper Functions

**For date-only field conversions (critical for offline-first):**

Import from `@/lib/utils`:

| Function                            | Purpose                                                       |
| ----------------------------------- | ------------------------------------------------------------- |
| `toDateString(date)`                | Convert Date → `'YYYY-MM-DD'` string (LOCAL time)             |
| `parseDateString(str)`              | Convert `'YYYY-MM-DD'` string → Date (LOCAL midnight)         |
| `createLocalDate(year, month, day)` | Create date from components (1-indexed month, LOCAL midnight) |

**For all other date operations:**

Use [date-fns](https://date-fns.org/) directly:

| date-fns Function                         | Purpose                                                  |
| ----------------------------------------- | -------------------------------------------------------- |
| `startOfToday()`                          | Get today at midnight local time                         |
| `startOfMonth(date)`, `endOfMonth(date)`  | Month boundaries                                         |
| `startOfYear(date)`, `endOfYear(date)`    | Year boundaries                                          |
| `addDays(date, n)`, `subDays(date, n)`    | Add/subtract days                                        |
| `addMonths(date, n)`, `addYears(date, n)` | Add months/years                                         |
| `isToday(date)`, `isYesterday(date)`      | Date comparisons                                         |
| `isSameDay(date1, date2)`                 | Compare calendar days                                    |
| `format(date, 'yyyy-MM-dd')`              | Format dates (use `toDateString` for date-only fields)   |
| `parse(str, 'yyyy-MM-dd', new Date())`    | Parse dates (use `parseDateString` for date-only fields) |

### Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TIMESTAMPS                                    │
├─────────────────────────────────────────────────────────────────────┤
│ Client (SQLite)     → PowerSync      → Server (Postgres)            │
│ TEXT                  TEXT             timestamptz                   │
│ '2024-12-25 10:00Z'   '2024-12-25...'  2024-12-25 10:00:00+00        │
│                                                                      │
│ new Date()          → toISOString()  → new Date(str)                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        DATE-ONLY                                     │
├─────────────────────────────────────────────────────────────────────┤
│ Client (SQLite)     → PowerSync      → Server (Postgres)            │
│ TEXT                  TEXT             date                          │
│ '2024-12-25'          '2024-12-25'     2024-12-25                    │
│                                                                      │
│ Date (local)        → toDateString() → Date.UTC() → date column     │
│ ⚠️ NEVER toISOString()                                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Best Practices

1. **For date-only fields**, use `toDateString()` and `parseDateString()` from `@/data/date-utils` - these ensure LOCAL time conversion
2. **For all other date operations**, use date-fns functions directly (e.g., `startOfToday()`, `addDays()`, `isToday()`)
3. **Use `new Date()` directly** only for timestamps (created_at, updated_at)
4. **Never use `.toISOString()`** on date-only Date objects - it may shift the calendar date
5. **When in doubt**, check if the field represents:
   - A moment in time → use timestamp approach (UTC)
   - A calendar date → use date-only approach (LOCAL time, string storage)

> **Key Point:** The string format (`'YYYY-MM-DD'` or ISO 8601) is what gets synced, not the JavaScript Date object. Design your date handling around string preservation to ensure offline sync safety.

---

## 7. File Size Limitations

The current database design limits file attachments to a maximum size of **2,147,483,647 bytes** (2 GiB - 1 byte, approximately 2 GB).

### Technical Details

This limitation comes from PostgreSQL's `integer` type (32-bit signed integer), which is used for the `file_size` column in the `attachments` table:

- **PostgreSQL `integer`**: 32-bit signed, range -2,147,483,648 to 2,147,483,647
- **SQLite `INTEGER`**: 64-bit signed (can store much larger values)

Since PostgreSQL is the server-side source of truth and uses the more restrictive type, the effective limit is determined by PostgreSQL's `integer` type. For file sizes (which are always positive), the maximum value is 2,147,483,647 bytes.

### Implications

- Files larger than ~2 GB cannot be stored in the current schema
- If larger file support is needed in the future, the `file_size` column would need to be changed to `bigint` on the server (and potentially on the client for consistency)
- Changing from `integer` to `bigint` would require a database migration

### Current Usage

This limit is sufficient for most use cases:

- Receipt photos: typically < 10 MB
- PDF documents: typically < 50 MB
- Voice messages: typically < 100 MB

For the vast majority of attachment use cases in a personal finance app, 2 GB is more than adequate.

> **Key Point:** The file size limit is determined by PostgreSQL's `integer` type. If larger files are needed in the future, migrate the `file_size` column to `bigint` on both server and client schemas.
