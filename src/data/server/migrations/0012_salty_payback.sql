ALTER TABLE "accounts" ADD CONSTRAINT "accounts_max_balance" CHECK ("accounts"."balance" <= 9007199254740991);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_max_target_amount" CHECK ("accounts"."savings_target_amount" IS NULL OR "accounts"."savings_target_amount" <= 9007199254740991);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_max_debt_initial_amount" CHECK ("accounts"."debt_initial_amount" IS NULL OR "accounts"."debt_initial_amount" <= 9007199254740991);--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_max_amount" CHECK ("budgets"."amount" <= 9007199254740991);--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_max_amount" CHECK ("transactions"."amount" <= 9007199254740991);