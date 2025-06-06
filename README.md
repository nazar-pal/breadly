# 🍞 Breadly

Breadly is a cross-platform **React Native** application that helps users track everyday spending, income and account balances in an elegant, privacy-first interface.

> **Status**  
> • UI MVP is live (Expo 53 + Expo Router 5)  
> • Backend schema is deployed on Neon, API routes run on Vercel  
> • AI receipts / voice entry coming soon via Vercel AI SDK

---

## 🛠 Tech Stack

| Layer              | Technologies                                                                 |
| :----------------- | :--------------------------------------------------------------------------- |
| **Mobile UI**      | React Native 0.79.2, Expo SDK 53, Expo Router 5.0.7, React Native StyleSheet |
| **State / Forms**  | TanStack Query · React Hook Form + Zod                                       |
| **Design / Icons** | Custom mid-tone theme · lucide-react-native                                  |
| **Backend DB**     | PostgreSQL (latest Neon)                                                     |
| **API / ORM**      | Drizzle ORM · **tRPC (via Vercel serverless API routes)**                    |
| **Auth**           | Clerk                                                                        |
| **File Storage**   | UploadThing                                                                  |
| **AI**             | **Vercel AI SDK** (LLM, Vision)                                              |
| **Deployment**     | Vercel (serverless / edge) · EAS Build & Submit                              |
| **Dev Tooling**    | drizzle kit migrations · Neon branching                                      |

---

## ✨ Core Features (v1)

### Accounts & Balances

- **Three account types**: `saving`, `payment`, `debt`
- **Auto-updated running balance** via PostgreSQL triggers on every transaction
- **Multi-currency support** with exchange rate tracking

### Categories & Classification

- **Hierarchical categories** with parent-child relationships
- Separate **income** vs **expense** category types
- **Optional categorization** - transactions can be uncategorized for quick entry

### Transactions

- **Unified transaction model** for `expenses`, `income` & `transfers`
- **Automatic balance updates** via database triggers
- **Multi-currency transactions** (must match account currency)
- **File attachments** support via UploadThing (`receipt` photos, `voice` messages)

### Budgets

- **Per-category spending limits** with configurable periods
- **Period types**: `daily`, `weekly`, `monthly`, `quarterly`, `yearly`
- **Start date tracking** for precise budget periods

### Multi-Currency

- **Currency reference table** with symbols and display names
- **Historical exchange rates** with date-based tracking
- **Per-user default currency** preferences

### Security & Data Integrity

- **Row-Level Security (RLS)** implemented via [Drizzle crudPolicy](https://neon.tech/docs/guides/neon-rls-drizzle) with [Neon RLS](https://neon.tech/docs/guides/neon-rls) and Clerk authentication
- **Multi-tenant isolation** - users can only access their own data using `auth.user_id()` function
- **Database-level business rule enforcement** (see below)
- **Cross-reference validation** via triggers

---

## 🗄 Database Schema

Breadly uses a **PostgreSQL database** on Neon with a sophisticated multi-tenant architecture designed for financial data management. The database enforces strict business rules, maintains data integrity through triggers, and provides row-level security for user isolation.

### **Core Architecture**

- **9 core tables** supporting accounts, transactions, categories, budgets, and multi-currency operations
- **Multi-tenant isolation** using Clerk authentication with Row-Level Security (RLS)
- **Automatic balance management** via PostgreSQL triggers
- **Currency consistency** enforced through database constraints and triggers

### **Key Tables**

- `accounts` - User financial accounts with auto-updated balances
- `transactions` - All money movements (income, expense, transfer)
- `categories` - Hierarchical transaction classification
- `budgets` - Per-category spending limits with configurable periods
- `currencies` & `exchange_rates` - Multi-currency support with historical tracking

### **Advanced Features**

- **Custom triggers** for automatic account balance updates
- **Multi-tenant security** validation at the database level
- **Currency validation** ensuring transaction-account currency consistency
- **Hierarchical categories** with parent-child relationships

> 📖 **For complete database documentation** including detailed table specifications, migration strategy, business rules, and security implementation, see [`server/db/DATABASE_DOCUMENTATION.md`](server/db/DATABASE_DOCUMENTATION.md)

---

## 🔒 Database Business Rules

The database enforces **comprehensive business rules** at the database level through constraints, triggers, and RLS policies:

### **Key Validations**

- ✅ **Multi-tenant security** - Users can only access their own data
- ✅ **Automatic balance updates** - Account balances maintained via triggers
- ✅ **Currency consistency** - Transaction currency must match account currency
- ✅ **Transfer validation** - Transfers require different source/destination accounts
- ✅ **Data integrity** - Positive amounts, valid dates, referential consistency

### **Custom SQL Migrations**

Breadly uses **4 manual SQL migrations** for advanced PostgreSQL features that Drizzle ORM doesn't support:

- **Balance triggers** for automatic account balance management
- **Security validation** for multi-tenant data isolation
- **Currency validation** for transaction-account consistency

> 📖 **For detailed business rules documentation** including trigger implementations, security policies, and validation logic, see [`server/db/DATABASE_DOCUMENTATION.md`](server/db/DATABASE_DOCUMENTATION.md)

---

## 🔮 Roadmap

1. **AI Receipt OCR & Voice Entry**
   - Powered by Vercel AI SDK + Vision / Whisper models.
2. **Web Dashboard**
   - Next.js front-end consuming the same tRPC backend.
3. **Advanced Analytics**
   - Spending trends, budget forecasting, and financial insights.

---

## License

MIT © 2025 Breadly
