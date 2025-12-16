ALTER TABLE "budgets" RENAME COLUMN "start_year" TO "budget_year";--> statement-breakpoint
ALTER TABLE "budgets" RENAME COLUMN "start_month" TO "budget_month";--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_valid_month";--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_yearly_starts_january";--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_valid_year";--> statement-breakpoint
DROP INDEX "budgets_user_archived_idx";--> statement-breakpoint
DROP INDEX "budgets_category_currency_active_unq";--> statement-breakpoint
DROP INDEX "budgets_category_currency_period_unq";--> statement-breakpoint
CREATE INDEX "budgets_year_month_idx" ON "budgets" USING btree ("budget_year","budget_month");--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_category_currency_period_unq" ON "budgets" USING btree ("category_id","currency","budget_year","budget_month");--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "is_archived";--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "archived_at";--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_monthly_has_month" CHECK ("budgets"."period" != 'monthly' OR ("budgets"."budget_month" >= 1 AND "budgets"."budget_month" <= 12));--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_yearly_no_month" CHECK ("budgets"."period" != 'yearly' OR "budgets"."budget_month" IS NULL);--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_valid_year" CHECK ("budgets"."budget_year" >= 1970 AND "budgets"."budget_year" <= 2100);