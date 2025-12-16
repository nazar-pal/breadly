# Server Database Triggers Documentation

This document provides a comprehensive overview of all PostgreSQL triggers and functions that enforce business rules and data integrity in the Breadly database.

## Overview

The Breadly database uses PostgreSQL triggers to enforce business rules that cannot be expressed as simple CHECK constraints or foreign keys. These triggers complement client-side Zod validation and ensure data integrity at the database level, serving as the final safety net for data validation.

**Trigger Strategy:**

- Triggers execute BEFORE INSERT/UPDATE operations
- They prevent invalid data from being committed to the database
- Client-side validation (Zod schemas) replicates these rules to prevent sync failures
- Server triggers catch edge cases and prevent data corruption

---

## Trigger Summary Table

| Trigger Name                                           | Table                     | Event          | Function                                      | Purpose                                              | Migration |
| ------------------------------------------------------ | ------------------------- | -------------- | --------------------------------------------- | ---------------------------------------------------- | --------- |
| `trg_validate_account_ownership`                       | `transactions`            | INSERT, UPDATE | `validate_account_ownership()`                | Validates account ownership for transactions         | 0003      |
| `trg_validate_category_ownership`                      | `transactions`            | INSERT, UPDATE | `validate_category_ownership()`               | Validates category ownership for transactions        | 0003      |
| `transaction_currency_validation_insert`               | `transactions`            | INSERT         | `validate_transaction_currency()`             | Validates currency matches account currency          | 0004      |
| `transaction_currency_validation_update`               | `transactions`            | UPDATE         | `validate_transaction_currency()`             | Validates currency matches account currency          | 0004      |
| `account_currency_change_validation`                   | `accounts`                | UPDATE         | `validate_account_currency_change()`          | Prevents currency changes when transactions exist    | 0004      |
| `trg_validate_category_nesting`                        | `categories`              | INSERT, UPDATE | `validate_category_nesting()`                 | Enforces maximum 2-level nesting                     | 0009      |
| `trg_validate_transaction_category_type`               | `transactions`            | INSERT         | `validate_transaction_category_type()`        | Validates category type matches transaction type     | 0010      |
| `trg_validate_transaction_category_type_update`        | `transactions`            | UPDATE         | `validate_transaction_category_type()`        | Validates category type matches transaction type     | 0010      |
| `trg_validate_category_parent_type`                    | `categories`              | INSERT         | `validate_category_parent_type()`             | Validates child category type matches parent         | 0012      |
| `trg_validate_category_parent_type_update`             | `categories`              | UPDATE         | `validate_category_parent_type()`             | Validates child category type matches parent         | 0012      |
| `trg_validate_budget_category`                         | `budgets`                 | INSERT         | `validate_budget_category()`                  | Validates budget category ownership and expense type | 0013      |
| `trg_validate_budget_category_update`                  | `budgets`                 | UPDATE         | `validate_budget_category()`                  | Validates budget category ownership and expense type | 0013      |
| `trg_validate_transaction_attachment_ownership`        | `transaction_attachments` | INSERT         | `validate_transaction_attachment_ownership()` | Validates transaction and attachment ownership       | 0013      |
| `trg_validate_transaction_attachment_ownership_update` | `transaction_attachments` | UPDATE         | `validate_transaction_attachment_ownership()` | Validates transaction and attachment ownership       | 0013      |
| `trg_validate_event_ownership`                         | `transactions`            | INSERT, UPDATE | `validate_event_ownership()`                  | Validates event ownership for transactions           | 0016      |

---

## Detailed Trigger Documentation

### 1. Security Validations (Multi-Tenant Isolation)

#### 1.1 Account Ownership Validation

**Function:** `validate_account_ownership()`  
**Trigger:** `trg_validate_account_ownership`  
**Table:** `transactions`  
**Events:** INSERT, UPDATE  
**Migration:** `0003_security_validations.sql`

**Purpose:**  
Ensures users can only create transactions using accounts they own, preventing cross-user data access in a multi-tenant system.

**Business Rules:**

- For non-transfer transactions: If `account_id` is provided, it must belong to the user
- For transfer transactions: Both `account_id` and `counter_account_id` must belong to the user
- Prevents unauthorized cross-tenant account access

**Client-Side Validation:**  
Client mutations validate account ownership before inserting/updating transactions.

---

#### 1.2 Category Ownership Validation

**Function:** `validate_category_ownership()`  
**Trigger:** `trg_validate_category_ownership`  
**Table:** `transactions`  
**Events:** INSERT, UPDATE  
**Migration:** `0003_security_validations.sql`

**Purpose:**  
Ensures users can only reference categories they own in transactions.

**Business Rules:**

- If `category_id` is provided, it must belong to the user creating the transaction
- Prevents cross-user category access

**Client-Side Validation:**  
Client mutations validate category ownership before inserting/updating transactions.

---

#### 1.3 Event Ownership Validation

**Function:** `validate_event_ownership()`  
**Trigger:** `trg_validate_event_ownership`  
**Table:** `transactions`  
**Events:** INSERT, UPDATE  
**Migration:** `0016_event_ownership_validation.sql`

**Purpose:**  
Ensures users can only link transactions to events they own.

**Business Rules:**

- If `event_id` is provided, it must belong to the user creating the transaction
- Prevents unauthorized cross-tenant event access

**Client-Side Validation:**  
Client mutations validate event ownership before inserting/updating transactions.

---

### 2. Currency Validations

#### 2.1 Transaction Currency Consistency

**Function:** `validate_transaction_currency()`  
**Triggers:** `transaction_currency_validation_insert`, `transaction_currency_validation_update`  
**Table:** `transactions`  
**Events:** INSERT, UPDATE  
**Migration:** `0004_currency_validation.sql`

**Purpose:**  
Enforces that transaction currency matches account currency. This cannot be implemented as a CHECK constraint because it requires subqueries.

**Business Rules:**

- For non-transfer transactions: If `account_id` is provided, transaction `currency_id` must match account's `currency_id`
- For transfer transactions: Transaction `currency_id` must match both source and destination account currencies
- Accountless transactions (no `account_id`) are allowed and not validated

**Client-Side Validation:**  
Client mutations validate currency consistency before inserting/updating transactions to prevent sync failures.

---

#### 2.2 Account Currency Change Protection

**Function:** `validate_account_currency_change()`  
**Trigger:** `account_currency_change_validation`  
**Table:** `accounts`  
**Events:** UPDATE  
**Migration:** `0004_currency_validation.sql`

**Purpose:**  
Prevents changing an account's currency when transactions already exist for that account, maintaining historical data integrity.

**Business Rules:**

- If `currency_id` is being changed, check if any transactions exist for this account
- If transactions exist (either as `account_id` or `counter_account_id`), raise an error
- Prevents currency mismatches in historical transaction data

**Client-Side Validation:**  
Client mutations check for existing transactions before allowing currency changes.

---

### 3. Category Validations

#### 3.1 Category Nesting Constraint

**Function:** `validate_category_nesting()`  
**Trigger:** `trg_validate_category_nesting`  
**Table:** `categories`  
**Events:** INSERT, UPDATE  
**Migration:** `0009_category_nesting.sql`

**Purpose:**  
Enforces maximum 2-level nesting for categories (parent → child only, no grandchildren).

**Business Rules:**

- Root categories (`parent_id = NULL`) are always allowed
- Child categories must have a parent with `parent_id = NULL`
- Grandchildren (parent's `parent_id IS NOT NULL`) are prohibited

**Client-Side Validation:**  
Client mutations validate nesting depth before inserting/updating categories.

---

#### 3.2 Category Parent Type Matching

**Function:** `validate_category_parent_type()`  
**Triggers:** `trg_validate_category_parent_type`, `trg_validate_category_parent_type_update`  
**Table:** `categories`  
**Events:** INSERT, UPDATE  
**Migration:** `0012_category_parent_type_validation.sql`

**Purpose:**  
Ensures child categories have the same type (income/expense) as their parent, preventing mixed hierarchies.

**Business Rules:**

- Root categories (`parent_id = NULL`) are always allowed
- Child categories must have the same `type` as their parent
- Prevents income categories under expense parents and vice versa

**Client-Side Validation:**  
Client mutations validate parent type matching before inserting/updating categories.

---

### 4. Transaction Validations

#### 4.1 Transaction Category Type Matching

**Function:** `validate_transaction_category_type()`  
**Triggers:** `trg_validate_transaction_category_type`, `trg_validate_transaction_category_type_update`  
**Table:** `transactions`  
**Events:** INSERT, UPDATE  
**Migration:** `0010_transaction_category_type_validation.sql`

**Purpose:**  
Ensures transaction type matches category type (expense→expense, income→income, transfer→no category).

**Business Rules:**

- Transfer transactions cannot have a `category_id` (must be NULL)
- Expense transactions can only use expense categories
- Income transactions can only use income categories
- Category type must match transaction type exactly

**Client-Side Validation:**  
Client mutations validate category type matching before inserting/updating transactions.

---

### 5. Budget Validations

#### 5.1 Budget Category Validation

**Function:** `validate_budget_category()`  
**Triggers:** `trg_validate_budget_category`, `trg_validate_budget_category_update`  
**Table:** `budgets`  
**Events:** INSERT, UPDATE  
**Migration:** `0013_budget_and_attachment_ownership_validation.sql`

**Purpose:**  
Ensures budgets can only be created for expense categories owned by the user.

**Business Rules:**

- Category must belong to the user creating the budget (ownership check)
- Category must be of type 'expense' (budgets don't apply to income)
- Prevents budgets for income categories or categories owned by other users

**Client-Side Validation:**  
Client mutations validate category ownership and expense type before creating/updating budgets.

---

### 6. Transaction-Attachment Validations

#### 6.1 Transaction-Attachment Ownership

**Function:** `validate_transaction_attachment_ownership()`  
**Triggers:** `trg_validate_transaction_attachment_ownership`, `trg_validate_transaction_attachment_ownership_update`  
**Table:** `transaction_attachments`  
**Events:** INSERT, UPDATE  
**Migration:** `0013_budget_and_attachment_ownership_validation.sql`

**Purpose:**  
Ensures both transaction and attachment belong to the user creating the link.

**Business Rules:**

- Transaction must belong to the user creating the link
- Attachment must belong to the user creating the link
- Prevents unauthorized cross-user links

**Client-Side Validation:**  
Client mutations validate ownership of both transaction and attachment before creating links.

---

## Trigger Execution Order

When multiple triggers fire on the same operation, they execute in the following order:

1. **Security Validations** (ownership checks)
   - Account ownership
   - Category ownership
   - Event ownership

2. **Currency Validations**
   - Transaction currency consistency
   - Account currency change protection

3. **Category Validations**
   - Nesting depth
   - Parent type matching

4. **Transaction Validations**
   - Category type matching

5. **Budget Validations**
   - Category ownership and expense type

6. **Transaction-Attachment Validations**
   - Ownership of both entities

---

## Client-Side Validation Strategy

All triggers have corresponding client-side validation in Zod schemas and mutation functions:

1. **Client Zod Schemas:** Replicate CHECK constraints and basic business rules
2. **Client Mutations:** Validate foreign key references and ownership before database operations
3. **Server Zod Schemas:** Basic type coercion during sync (minimal)
4. **PostgreSQL Triggers:** Final safety net that catches edge cases and prevents data corruption

This multi-layer approach ensures:

- Fast client-side feedback (Zod validation)
- Proactive error prevention (mutation validation)
- Data integrity guarantee (server constraints and triggers)

For detailed documentation of the validation architecture, see [ValidationStrategy.md](./ValidationStrategy.md).

---

## Maintenance Notes

- **Adding New Triggers:** Update this document and add a comment in the migration file
- **Modifying Triggers:** Update both the migration file and this document
- **Removing Triggers:** Document the removal reason and update this file
- **Testing:** All triggers should be tested in integration tests to ensure they work correctly

---

## Related Documentation

- [Database Design Guidelines](./DatabaseDesignGuidelines.md) - Overall database design principles
- Client Schema Files - Zod validation schemas that replicate trigger logic
- Migration Files - SQL files containing trigger definitions
