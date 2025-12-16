ALTER TABLE "budgets" DROP CONSTRAINT "budgets_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_counter_account_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_category_id_categories_id_fk";
--> statement-breakpoint
DROP INDEX "accounts_user_archived_idx";--> statement-breakpoint
DROP INDEX "accounts_user_type_idx";--> statement-breakpoint
DROP INDEX "attachments_type_idx";--> statement-breakpoint
DROP INDEX "attachments_status_idx";--> statement-breakpoint
DROP INDEX "attachments_user_type_idx";--> statement-breakpoint
DROP INDEX "attachments_user_status_idx";--> statement-breakpoint
DROP INDEX "attachments_created_at_idx";--> statement-breakpoint
DROP INDEX "budgets_year_month_idx";--> statement-breakpoint
DROP INDEX "budgets_category_currency_period_unq";--> statement-breakpoint
DROP INDEX "categories_user_archived_idx";--> statement-breakpoint
DROP INDEX "categories_user_type_idx";--> statement-breakpoint
DROP INDEX "categories_user_parent_name_unq";--> statement-breakpoint
DROP INDEX "events_user_archived_idx";--> statement-breakpoint
DROP INDEX "events_start_date_idx";--> statement-breakpoint
DROP INDEX "transactions_user_date_idx";--> statement-breakpoint
DROP INDEX "transactions_user_type_idx";--> statement-breakpoint
DROP INDEX "transactions_date_idx";--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_counter_account_id_accounts_id_fk" FOREIGN KEY ("counter_account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "currencies_code_unq" ON "currencies" USING btree ("code");--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_currency_period_unq" UNIQUE NULLS NOT DISTINCT("category_id","currency","budget_year","budget_month");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_parent_name_unq" UNIQUE NULLS NOT DISTINCT("user_id","parent_id","name");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_name_not_empty" CHECK (length(trim("events"."name")) > 0);