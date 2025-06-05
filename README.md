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

- Saving, payment and debt accounts
- Auto-updated running balance on every transaction
- Nightly **balance snapshots** for fast charts (cron job)

### Categories & Tags

- Separate **income** vs **expense** categories with colors
- Many-to-many **tags** for ad-hoc grouping (“vacation”, “tax-deductible”)

### Transactions

- Single `transactions` table for **expenses, incomes & transfers**
- Unlimited **receipt** attachments via UploadThing

### Recurring Rules

- `daily · weekly · monthly · yearly` schedules
- Server-side cron task inserts upcoming occurrences into `transactions`

### Budgets

- Per-category spending limits with start & end dates
- Materialised view powers instant overspend alerts

### Multi-Currency

- `currencies` + `exchange_rates` reference tables
- Daily FX refresh function
- Per-user **default currency** preference

### Security

- **Row-Level Security** on every user-scoped table (`user_id = current_setting('jwt.claims.user_id')::uuid`)
- Clerk JWT validated in tRPC middleware → sets Postgres `jwt.claims`

---

## 🗄 Key Database Tables

| Table                      | Purpose                                     |
| :------------------------- | :------------------------------------------ |
| `accounts`                 | Wallets/bank cards with running `balance`   |
| `categories`               | Income or expense groups                    |
| `transactions`             | All money movements (+/-)                   |
| `recurring_rules`          | Generates future transactions automatically |
| `exchange_rates`           | Daily FX rates for conversions              |
| `receipts`                 | File metadata linked to transactions        |
| `budgets`                  | Per-period spending limits                  |
| `tags`, `transaction_tags` | Flexible labelling system                   |
| `user_prefs`               | Currency, locale, week-start, etc.          |

---

## 🔮 Roadmap

1. **AI Receipt OCR & Voice Entry**
   - Powered by Vercel AI SDK + Vision / Whisper models.
2. **Shared Workspaces**
   - Multiple users per workspace with granular RLS policies.
3. **Web Dashboard**
   - Next.js front-end consuming the same tRPC backend.

---

## License

MIT © 2025 Breadly
