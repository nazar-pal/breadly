ALTER TABLE "budgets" RENAME COLUMN "currency" TO "currency_id";--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_category_currency_period_unq";--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_currency_currencies_code_fk";
--> statement-breakpoint
DROP INDEX "currencies_code_unq";--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_currency_id_currencies_code_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_currency_period_unq" UNIQUE NULLS NOT DISTINCT("category_id","currency_id","budget_year","budget_month");