# Database Validation Strategy

**Multi-Layer Validation Architecture for Offline-First PowerSync Applications**

---

## Overview

Breadly uses a **4-layer validation architecture** to ensure data integrity across client and server environments. This strategy balances proactive client-side validation (for better UX) with authoritative server-side enforcement (for security and correctness).

---

## The 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     VALIDATION LAYERS                           │
├─────────────────────────────────────────────────────────────────┤
│ Layer 1: Client Zod Schemas                                     │
│   - Replicates CHECK constraints                                │
│   - Type coercion and formatting                                │
│   - Cross-field validations (within single record)              │
├─────────────────────────────────────────────────────────────────┤
│ Layer 2: Client Mutations                                       │
│   - FK existence validation                                     │
│   - Ownership validation                                        │
│   - Cross-table business rules (category type, currency match)  │
│   - Unique constraint checks                                    │
├─────────────────────────────────────────────────────────────────┤
│ Layer 3: Server Zod Schemas (via sync.ts)                       │
│   - Basic type coercion (no custom refinements)                 │
│   - Relies on DB for business rules                             │
├─────────────────────────────────────────────────────────────────┤
│ Layer 4: PostgreSQL Constraints + Triggers                      │
│   - Final safety net                                            │
│   - CHECK constraints, FKs, unique indexes                      │
│   - Custom triggers for complex rules                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Client Zod Schemas

**Location:** `src/data/client/db-schema/table_*.ts`

**Purpose:** Replicate server CHECK constraints and provide immediate feedback to users.

**What it validates:**
- Field-level constraints (positive amounts, non-empty strings, valid ranges)
- Cross-field validations within a single record (e.g., transfer rules, period/month consistency)
- Type coercion and formatting (rounding decimals, trimming strings)

**Example:**
```typescript
export const transactionInsertSchema = createInsertSchema(transactions, {
  amount: s => s.positive().max(VALIDATION.MAX_TRANSACTION_AMOUNT).transform(roundToTwoDecimals),
  // ...
})
.refine(data => data.type !== 'transfer' || data.accountId != null, {
  message: 'Transfer must have a source account',
  path: ['accountId']
})
```

**Why this layer exists:**
- PowerSync JSON-based views don't enforce CHECK constraints
- Provides immediate user feedback before sync
- Prevents invalid data from entering the local database

---

## Layer 2: Client Mutations

**Location:** `src/data/client/mutations/*.ts`

**Purpose:** Validate foreign key relationships, ownership, and cross-table business rules that require database lookups.

**What it validates:**
- Foreign key existence (currency, category, account, event exist)
- Ownership (entity belongs to the user)
- Cross-table business rules:
  - Category type matches transaction type
  - Currency matches account currency
  - Parent category type matches child type
  - No archived entities in new transactions
- Unique constraints (name uniqueness within user+parent scope)

**Example:**
```typescript
// Validate category exists, belongs to user, is not archived, and type matches
if (parsedData.categoryId) {
  const category = await tx.query.categories.findFirst({
    where: and(eq(categories.id, parsedData.categoryId), eq(categories.userId, userId))
  })
  if (!category) throw new Error('Category not found')
  if (category.isArchived)
    throw new Error('Cannot use archived category for new transaction')
  if (category.type !== parsedData.type) {
    throw new Error(`Cannot use ${category.type} category for ${parsedData.type} transaction`)
  }
}
```

**Why this layer exists:**
- Zod schemas can't perform database lookups
- Validates relationships before sync to prevent server rejections
- Ensures data consistency in offline scenarios

---

## Layer 3: Server Zod Schemas

**Location:** `src/data/server/db-schema/index.ts` (via `createInsertSchema`/`createUpdateSchema`)

**Purpose:** Basic type coercion during sync operations.

**What it validates:**
- Basic type checking (strings, numbers, booleans)
- No custom refinements or complex validations

**Example:**
```typescript
export const transactionsInsertSchemaPg = createInsertSchema(transactions)
// No custom refinements - relies on PostgreSQL for validation
```

**Why this layer is minimal:**
- Client already validates before sync
- PostgreSQL enforces all constraints anyway
- Duplicating Zod refinements would add complexity without benefit
- Server acts as final authority, not duplicate validator

---

## Layer 4: PostgreSQL Constraints + Triggers

**Location:** 
- Constraints: `src/data/server/db-schema/table_*.ts`
- Triggers: `src/data/server/migrations/*.sql`

**Purpose:** Final safety net and authoritative enforcement of all business rules.

**What it validates:**

### CHECK Constraints
- Field-level rules (positive amounts, valid ranges, non-empty strings)
- Cross-field rules within a record (transfer account rules, period/month consistency)

### Foreign Keys
- Referential integrity (currency, category, account, event exist)
- Cascade behaviors (RESTRICT, SET NULL, CASCADE)

### Unique Indexes
- Name uniqueness within user+parent scope
- Budget uniqueness per category+currency+period

### Triggers
- Cross-table validations requiring lookups:
  - Account/category/event ownership
  - Currency consistency (transaction matches account)
  - Category type matching (transaction ↔ category, parent ↔ child)
  - Budget category validation (expense-only, ownership)
  - Category nesting limits (max 2 levels)

**Example:**
```sql
-- CHECK constraint
check('transactions_positive_amount', sql`${table.amount} > 0`)

-- Trigger
CREATE TRIGGER trg_validate_transaction_category_type
BEFORE INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION validate_transaction_category_type();
```

**Why this layer exists:**
- Final authority - prevents invalid data even if client validation is bypassed
- Enforces multi-tenant security (RLS policies)
- Handles edge cases and concurrent modifications
- Ensures data integrity across all devices after sync

---

## Validation Mapping Reference

| Validation Type | Client Zod | Client Mutation | Server Zod | Server DB |
|----------------|------------|-----------------|------------|-----------|
| Positive amount | ✅ | - | - | ✅ CHECK |
| Transfer rules | ✅ | ✅ (merged state) | - | ✅ CHECK |
| Category type match | - | ✅ | - | ✅ Trigger |
| Currency consistency | - | ✅ | - | ✅ Trigger |
| Name non-empty | ✅ | - | - | ✅ CHECK |
| Unique names | - | ✅ | - | ✅ UNIQUE |
| FK existence | - | ✅ | - | ✅ FK |
| Ownership | - | ✅ | - | ✅ Trigger + RLS |
| Archived entity check | - | ✅ | - | - |
| Nesting limits | - | ✅ | - | ✅ Trigger |

---

## Guidelines for Adding New Validations

### When to add validation to each layer:

1. **Client Zod Schema:**
   - ✅ Field-level constraints (positive, range, format)
   - ✅ Cross-field rules within single record (no DB lookups)
   - ❌ Don't add if it requires database queries

2. **Client Mutation:**
   - ✅ Foreign key existence checks
   - ✅ Ownership validation
   - ✅ Cross-table business rules requiring lookups
   - ✅ Unique constraint checks
   - ✅ Archived entity checks
   - ❌ Don't duplicate Zod schema validations

3. **Server Zod Schema:**
   - ✅ Basic type coercion only
   - ❌ Don't add custom refinements (DB handles it)

4. **PostgreSQL:**
   - ✅ All CHECK constraints (replicated in Client Zod)
   - ✅ Foreign keys (validated in Client Mutation)
   - ✅ Unique indexes (checked in Client Mutation)
   - ✅ Triggers for complex cross-table rules (validated in Client Mutation)
   - ✅ RLS policies for multi-tenant security

### Example: Adding a new validation rule

**Scenario:** Prevent transactions with future dates beyond 1 year.

1. **Client Zod** (`table_7_transactions.ts`):
   ```typescript
   .refine(data => {
     const maxDate = new Date()
     maxDate.setFullYear(maxDate.getFullYear() + 1)
     return data.txDate <= maxDate
   }, {
     message: 'Transaction date cannot be more than 1 year in the future',
     path: ['txDate']
   })
   ```

2. **Client Mutation** (`create-transaction.ts`):
   - Not needed (Zod handles it)

3. **Server Zod** (`table_7_transactions.ts`):
   - Not needed (minimal by design)

4. **PostgreSQL** (`table_7_transactions.ts`):
   ```typescript
   check('transactions_max_future_date', 
     sql`${table.txDate} <= (CURRENT_DATE + INTERVAL '1 year')`)
   ```

---

## Redundancy Strategy

**Is validation duplication a problem?**

No. The redundancy is **intentional and beneficial**:

1. **Client Zod + Server CHECK:** Client provides immediate feedback; server ensures correctness even if client is bypassed.

2. **Client Mutation + Server Trigger:** Client prevents sync failures; server enforces security and handles edge cases.

3. **Client Mutation + Server FK:** Client validates offline; server ensures referential integrity across all devices.

**Key Principle:** Each layer validates what it's best suited for. The server is the final authority, but client validation improves UX and reduces sync errors.

---

## Testing Considerations

When testing validations:

1. **Test Client Zod:** Verify immediate feedback in UI
2. **Test Client Mutations:** Verify offline validation prevents invalid data
3. **Test Server Constraints:** Verify server rejects invalid data even if client validation is bypassed
4. **Test Triggers:** Verify complex cross-table rules are enforced

**Note:** In an offline-first app, client validation is critical because users may be offline for extended periods. Invalid data caught early prevents sync failures later.

---

## Related Documentation

- [DatabaseDesignGuidelines.md](./DatabaseDesignGuidelines.md) - PowerSync-specific design considerations
- [TRIGGERS.md](./TRIGGERS.md) - Server trigger documentation (if exists)

