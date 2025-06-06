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

### Core Tables

| Table                     | Purpose                                         |
| :------------------------ | :---------------------------------------------- |
| `currencies`              | Supported currencies (USD, EUR, etc.)           |
| `exchange_rates`          | Historical currency exchange rates              |
| `accounts`                | User financial accounts with running balances   |
| `categories`              | Hierarchical income/expense classification      |
| `transactions`            | All money movements (income, expense, transfer) |
| `attachments`             | File storage metadata (receipts, voice notes)   |
| `transaction_attachments` | Many-to-many link between transactions & files  |
| `budgets`                 | Per-category spending limits with periods       |
| `user_preferences`        | User settings (default currency, locale, etc.)  |

---

## 🔒 Database Business Rules

The following business rules are **enforced at the database level** through constraints, triggers, and RLS policies:

### Data Integrity Rules

- **Positive amounts**: All transaction amounts must be > 0
- **Currency consistency**: Transaction currency must match account currency
- **Transfer validation**: Transfers require different source/destination accounts
- **Date validation**: Transaction dates cannot be in the future
- **Category hierarchy**: Categories cannot be their own parent
- **Unique budgets**: No duplicate budgets per category+period+date

### Account Balance Management

- **Automatic updates**: Account balances updated via PostgreSQL triggers
- **Income transactions**: Add amount to account balance
- **Expense transactions**: Subtract amount from account balance
- **Transfer transactions**: Move money between accounts atomically
- **Update handling**: Balance correctly maintained on transaction modifications

### Multi-Tenant Security

- **Row-Level Security**: Implemented using Drizzle's `crudPolicy` with `authUid()` helper and Neon's `auth.user_id()` function
- **Account ownership**: Users can only use accounts they own in transactions
- **Category ownership**: Users can only reference categories they own
- **Attachment access**: Users can only access attachments via their transactions
- **Cross-user prevention**: No data leakage between users

### Exchange Rate Integrity

- **Positive rates**: Exchange rates must be > 0
- **Currency pairs**: Base and quote currencies must be different
- **Unique rates**: One rate per currency pair per date

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
