# 🗄️ Breadly Database Documentation

## Overview

Breadly uses a **PostgreSQL database** hosted on **Neon** with a sophisticated multi-tenant architecture designed for financial data management. The database enforces strict business rules, maintains data integrity through triggers and constraints, and provides row-level security for user isolation.

---

## 🎯 Database Architecture

### **Multi-Tenant Design**

- **User Isolation**: All user data is isolated using Clerk authentication (`auth.user_id()`)
- **Row-Level Security (RLS)**: Implemented using Drizzle's `crudPolicy` with Neon's `authUid()` helper
- **Zero Cross-User Access**: Database triggers prevent unauthorized data access between users

### **Currency & Localization**

- **Multi-Currency Support**: Full support for different currencies with exchange rate tracking
- **ISO 4217 Standard**: All currency codes follow international standards (USD, EUR, etc.)
- **Historical Rates**: Exchange rates are tracked with dates for accurate historical conversions

### **Data Integrity**

- **Database-Level Validation**: Business rules enforced through triggers and constraints
- **Automatic Balance Management**: Account balances updated automatically via PostgreSQL triggers
- **Referential Integrity**: Foreign key constraints ensure data consistency

---

## 📊 Schema Overview

### **Core Tables**

| Table                     | Purpose                                       | User-Owned         | RLS Enabled |
| ------------------------- | --------------------------------------------- | ------------------ | ----------- |
| `currencies`              | ISO currency definitions (USD, EUR, etc.)     | ❌ Global          | ❌          |
| `exchange_rates`          | Historical currency conversion rates          | ❌ Global          | ❌          |
| `accounts`                | User financial accounts with balances         | ✅                 | ✅          |
| `categories`              | Hierarchical transaction classification       | ✅                 | ✅          |
| `transactions`            | All money movements (income/expense/transfer) | ✅                 | ✅          |
| `attachments`             | File metadata (receipts, voice notes)         | ❌ Shared          | ❌          |
| `transaction_attachments` | Many-to-many transaction ↔ attachment links  | ✅ Via Transaction | ✅          |
| `budgets`                 | Per-category spending limits                  | ✅                 | ✅          |
| `user_preferences`        | User settings and defaults                    | ✅                 | ✅          |

---

## 📋 Detailed Table Specifications

### **1. currencies**

```sql
-- ISO 4217 currency definitions
CREATE TABLE currencies (
  code VARCHAR(3) PRIMARY KEY,     -- ISO currency code (USD, EUR)
  symbol VARCHAR(10) NOT NULL,     -- Display symbol ($, €, £)
  name VARCHAR(100) NOT NULL       -- Full name (US Dollar)
);
```

**Purpose**: Global currency reference table supporting international monetary transactions.

### **2. exchange_rates**

```sql
-- Historical currency exchange rates
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency VARCHAR(3) REFERENCES currencies(code),
  quote_currency VARCHAR(3) REFERENCES currencies(code),
  rate NUMERIC NOT NULL CHECK (rate > 0),
  rate_date DATE NOT NULL,
  UNIQUE(base_currency, quote_currency, rate_date)
);
```

**Purpose**: Track exchange rates over time for accurate multi-currency conversions.

### **3. accounts**

```sql
-- User financial accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) DEFAULT auth.user_id() NOT NULL,
  type account_type NOT NULL,           -- 'saving', 'payment', 'debt'
  name VARCHAR(100) NOT NULL,
  description VARCHAR(1000),
  currency_id VARCHAR(3) REFERENCES currencies(code),
  balance NUMERIC(14,2) DEFAULT 0,      -- Auto-updated by triggers
  is_archived BOOLEAN DEFAULT FALSE NOT NULL,
  archived_at TIMESTAMPTZ
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Purpose**: Store user financial accounts with automatic balance tracking.

### **4. categories**

```sql
-- Hierarchical transaction categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) DEFAULT auth.user_id() NOT NULL,
  type category_type NOT NULL,          -- 'expense', 'income'
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(1000),
  icon VARCHAR(50) DEFAULT 'circle' NOT NULL,
  is_archived BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, parent_id, name)
);
```

**Purpose**: Organize transactions into hierarchical categories for reporting and budgeting.

### **5. transactions**

```sql
-- All financial transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) DEFAULT auth.user_id() NOT NULL,
  type transaction_type NOT NULL,       -- 'expense', 'income', 'transfer'
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE, -- Optional for non-transfer; required for transfer
  counter_account_id UUID REFERENCES accounts(id),  -- For transfers
  category_id UUID REFERENCES categories(id),
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency_id VARCHAR(3) REFERENCES currencies(code) NOT NULL,
  tx_date DATE NOT NULL CHECK (tx_date <= CURRENT_DATE),
  notes VARCHAR(1000),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Purpose**: Central table tracking all money movements with automatic balance updates. For non-transfer transactions, `account_id` is optional; for transfers, both `account_id` and `counter_account_id` are required.

### **6. attachments**

```sql
-- File attachment metadata
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type attachment_type NOT NULL,        -- 'receipt', 'voice'
  bucket_path TEXT NOT NULL,            -- Cloud storage path
  mime VARCHAR(150) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_size NUMERIC NOT NULL CHECK (file_size > 0),
  duration NUMERIC CHECK (duration IS NULL OR duration > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Purpose**: Store metadata for receipts and voice messages attached to transactions.

### **7. transaction_attachments**

```sql
-- Many-to-many transaction ↔ attachment relationships
CREATE TABLE transaction_attachments (
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,
  attachment_id UUID REFERENCES attachments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (transaction_id, attachment_id)
);
```

**Purpose**: Link transactions to their supporting documents and voice notes.

### **8. budgets**

```sql
-- Category-based spending limits
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) DEFAULT auth.user_id() NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  period budget_period DEFAULT 'monthly' NOT NULL,  -- daily/weekly/monthly/quarterly/yearly
  start_date DATE NOT NULL,
  UNIQUE(category_id, period, start_date)
);
```

**Purpose**: Track spending limits for categories across different time periods.

### **9. user_preferences**

```sql
-- User application settings
CREATE TABLE user_preferences (
  user_id VARCHAR(50) DEFAULT auth.user_id() PRIMARY KEY NOT NULL,
  default_currency VARCHAR(3) REFERENCES currencies(code),
  first_weekday NUMERIC DEFAULT 1 CHECK (first_weekday BETWEEN 1 AND 7),
  locale VARCHAR(20) DEFAULT 'en-US'
);
```

**Purpose**: Store user-specific application preferences and defaults.

---

## 🔧 Migration Strategy

### **Generated vs Manual Migrations**

Breadly uses a **hybrid migration approach** combining Drizzle Kit's automatic schema generation with manual SQL migrations for advanced database features:

#### **Generated Migrations (Drizzle Kit)**

- **0000_init.sql**: Complete schema initialization generated by Drizzle Kit
- **0005\_\*.sql**: Schema changes generated by `drizzle-kit generate`

#### **Manual Migrations (Custom SQL)**

The following migrations are **manually created** because Drizzle ORM doesn't support PostgreSQL functions and triggers:

### **Migration 0001: Account Balance Insert/Delete**

```sql
-- File: 0001_account_balance_insert_delete.sql
-- Purpose: Automatic balance updates on transaction INSERT/DELETE
```

**Functions Created:**

- `update_account_balance()`: Handles transaction creation and deletion
- `trg_update_balance`: Trigger executing after INSERT/DELETE on transactions

**Business Logic:**

- **Income**: Adds amount to account balance
- **Expense**: Subtracts amount from account balance
- **Transfer**: Moves money from source to destination account
- **Deletion**: Reverses the original transaction's effect

### **Migration 0002: Account Balance Updates**

```sql
-- File: 0002_account_balance_updates.sql
-- Purpose: Automatic balance updates on transaction UPDATE
```

**Functions Created:**

- `update_account_balance_on_update()`: Handles transaction modifications
- `trg_update_balance_on_update`: Trigger executing before UPDATE on transactions

**Two-Step Process:**

1. **Reverse**: Undo the old transaction's balance effect
2. **Apply**: Apply the new transaction's balance effect

### **Migration 0003: Multi-Tenant Security**

```sql
-- File: 0003_security_validations.sql
-- Purpose: Enforce user ownership of accounts and categories
```

**Functions Created:**

- `validate_account_ownership()`: Ensures users only access their accounts
- `validate_category_ownership()`: Ensures users only access their categories
- Associated triggers for both functions

**Security Rules:**

- Users can only create transactions using accounts they own
- Users can only reference categories they own
- Transfer transactions must use accounts owned by the same user
- Prevents unauthorized cross-tenant data access

### **Migration 0004: Currency Validation**

```sql
-- File: 0004_currency_validation.sql
-- Purpose: Enforce currency consistency rules
```

**Functions Created:**

- `validate_transaction_currency()`: Ensures currency consistency
- `validate_account_currency_change()`: Prevents currency changes when transactions exist
- Associated triggers for validation

**Currency Rules:**

- Transaction currency must match account currency
- Transfer accounts must use the same currency
- Account currency cannot be changed if transactions exist

---

## 🔒 Security Implementation

### **Row-Level Security (RLS)**

All user-owned tables implement RLS using Drizzle's `crudPolicy`:

```typescript
crudPolicy({
  role: authenticatedRole,
  read: authUid(table.userId),
  modify: authUid(table.userId)
})
```

**Policy Structure:**

- **READ**: Users can only see their own records
- **INSERT/UPDATE/DELETE**: Users can only modify their own records
- **Authentication**: Enforced via Clerk's `auth.user_id()` function

### **Special Case: transaction_attachments**

Attachment access is controlled through transaction ownership:

```sql
-- RLS Policy for transaction_attachments
EXISTS (
  SELECT 1 FROM transactions t
  WHERE t.id = transaction_attachments.transaction_id
  AND t.user_id = auth.user_id()
)
```

---

## 📏 Business Rules Enforcement

### **Database-Level Constraints**

#### **Data Validation**

- ✅ **Positive Amounts**: All monetary amounts must be > 0
- ✅ **Future Dates**: Transaction dates cannot be in the future
- ✅ **Self-Reference**: Categories cannot be their own parent
- ✅ **Currency Pairs**: Exchange rate base ≠ quote currency

#### **Transaction Rules**

- ✅ **Transfer Validation**: Transfers require different source/destination accounts
- ✅ **Counter Account**: Only transfers can have counter_account_id
- ✅ **Currency Consistency**: Transaction currency = account currency
- ✅ **Account Ownership**: Users can only reference their own accounts/categories

#### **Business Logic**

- ✅ **Unique Categories**: No duplicate names per user+parent
- ✅ **Unique Budgets**: No duplicate budgets per category+period+date
- ✅ **Unique Exchange Rates**: One rate per currency pair per date
- ✅ **Archive Integrity**: Archived records preserve historical data

### **Trigger-Enforced Rules**

#### **Balance Management**

- **INSERT**: Automatically update account balances when transactions are created
- **UPDATE**: Handle balance adjustments when transactions are modified
- **DELETE**: Reverse balance effects when transactions are removed

#### **Security Validation**

- **Account Ownership**: Validate user owns referenced accounts
- **Category Ownership**: Validate user owns referenced categories
- **Currency Consistency**: Enforce matching currencies between transactions and accounts

---

## 🔗 Relationships & Foreign Keys

### **Core Relationships**

```
currencies (1) ←→ (N) accounts
currencies (1) ←→ (N) transactions
currencies (1) ←→ (N) user_preferences
currencies (1) ←→ (N) exchange_rates (base)
currencies (1) ←→ (N) exchange_rates (quote)

accounts (1) ←→ (N) transactions
accounts (1) ←→ (N) transactions (counter_account)

categories (1) ←→ (N) categories (parent-child)
categories (1) ←→ (N) transactions
categories (1) ←→ (N) budgets

transactions (N) ←→ (N) attachments (via transaction_attachments)
```

### **Cascade Behaviors**

| Relationship                           | ON DELETE |
| -------------------------------------- | --------- |
| accounts → transactions                | CASCADE   |
| categories → categories (parent)       | CASCADE   |
| categories → budgets                   | CASCADE   |
| transactions → transaction_attachments | CASCADE   |
| attachments → transaction_attachments  | CASCADE   |

---

## 🏗️ Indexes & Performance

### **Performance Optimization**

#### **User-Centric Indexes**

- `accounts_user_idx`: Fast user account lookups
- `categories_user_idx`: Fast user category lookups
- `transactions_user_idx`: Fast user transaction lookups
- `budgets_user_idx`: Fast user budget lookups

#### **Query-Specific Indexes**

- `transactions_user_date_idx`: Date-based transaction queries
- `transactions_account_idx`: Account transaction history
- `transactions_category_idx`: Category spending analysis
- `exchange_rates_base_quote_date_unq`: Currency conversion lookups

#### **Composite Indexes**

- `accounts_user_archived_idx`: Active accounts only
- `categories_user_parent_name_unq`: Enforce unique category names
- `budgets_category_period_start_unq`: Prevent duplicate budgets

---

## 🚀 Deployment & Tools

### **Technology Stack**

- **Database**: PostgreSQL (latest) on Neon
- **ORM**: Drizzle ORM with Drizzle Kit
- **Migrations**: Hybrid approach (generated + manual)
- **Authentication**: Clerk with RLS integration
- **Branching**: Neon database branching for development

### **Development Workflow**

1. **Schema Changes**: Modify TypeScript schema files
2. **Generate Migration**: Run `drizzle-kit generate`
3. **Manual Triggers**: Add custom SQL for triggers/functions
4. **Apply Migration**: Run `drizzle-kit push` or deploy via CI/CD
5. **Test**: Verify business rules and security in staging branch

### **File Organization**

```
server/db/
├── migrations/           # SQL migration files
│   ├── 0000_init.sql    # Generated: Initial schema
│   ├── 0001_*.sql       # Manual: Balance triggers
│   ├── 0002_*.sql       # Manual: Update triggers
│   ├── 0003_*.sql       # Manual: Security validation
│   ├── 0004_*.sql       # Manual: Currency validation
│   └── 0005_*.sql       # Generated: Schema changes
├── schema/              # TypeScript schema definitions
│   ├── table_*.ts       # Individual table definitions
│   ├── utils.ts         # Reusable column utilities
│   └── index.ts         # Schema exports
└── index.ts             # Database connection & exports
```

---

## 🔮 Future Considerations

### **Scalability**

- **Partitioning**: Consider partitioning large tables by user_id or date
- **Read Replicas**: Use read replicas for reporting queries
- **Archiving**: Implement data archiving for old transactions

### **Features**

- **Multi-Currency Balances**: Support accounts with multiple currency balances
- **Exchange Rate APIs**: Automatic exchange rate updates from external services
- **Audit Logging**: Track all changes for compliance and debugging
- **Soft Deletes**: Implement soft deletion for critical financial records

---

_This documentation reflects the current state of the Breadly database as of the latest migration. For schema changes, please update both the TypeScript definitions and this documentation._
