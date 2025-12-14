CREATE TYPE "public"."budget_period" AS ENUM('monthly', 'yearly');--> statement-breakpoint
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_valid_date_range";--> statement-breakpoint
DROP INDEX "budgets_category_start_end_unq";--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "period" "budget_period" NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "start_year" smallint NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "start_month" smallint NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_category_currency_active_unq" ON "budgets" USING btree ("category_id","currency") WHERE "budgets"."is_archived" = false;--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_category_currency_period_unq" ON "budgets" USING btree ("category_id","currency","start_year","start_month");--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "end_date";--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_valid_month" CHECK ("budgets"."start_month" >= 1 AND "budgets"."start_month" <= 12);--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_valid_year" CHECK ("budgets"."start_year" >= 1970 AND "budgets"."start_year" <= 2100);--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_yearly_starts_january" CHECK ("budgets"."period" != 'yearly' OR "budgets"."start_month" = 1);