ALTER TABLE "accounts" ALTER COLUMN "currency_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "balance" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "default_currency" SET NOT NULL;