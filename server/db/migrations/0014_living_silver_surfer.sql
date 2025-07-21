DROP INDEX "budgets_user_period_idx";--> statement-breakpoint
DROP INDEX "budgets_category_period_start_unq";--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "currency" varchar(3) NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "end_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_currency_currencies_code_fk" FOREIGN KEY ("currency") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_category_start_end_unq" ON "budgets" USING btree ("category_id","currency","start_date","end_date");--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "period";--> statement-breakpoint
DROP TYPE "public"."budget_period";