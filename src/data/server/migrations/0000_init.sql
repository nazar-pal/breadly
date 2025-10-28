CREATE TYPE "public"."category_type" AS ENUM('expense', 'income');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('saving', 'payment', 'debt');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('expense', 'income', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."attachment_type" AS ENUM('receipt', 'voice');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"type" "account_type" NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"currency_id" varchar(3) DEFAULT 'USD' NOT NULL,
	"balance" numeric(14, 2) DEFAULT '0' NOT NULL,
	"savings_target_amount" numeric(14, 2),
	"savings_target_date" date,
	"debt_initial_amount" numeric(14, 2),
	"debt_is_owed_to_me" boolean,
	"debt_due_date" date,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_name_not_empty" CHECK (length(trim("accounts"."name")) > 0),
	CONSTRAINT "accounts_positive_target_amount" CHECK ("accounts"."savings_target_amount" IS NULL OR "accounts"."savings_target_amount" > 0),
	CONSTRAINT "accounts_positive_debt_initial_amount" CHECK ("accounts"."debt_initial_amount" IS NULL OR "accounts"."debt_initial_amount" > 0),
	CONSTRAINT "accounts_savings_fields_only_for_saving" CHECK (("accounts"."type" = 'saving') OR ("accounts"."savings_target_amount" IS NULL AND "accounts"."savings_target_date" IS NULL)),
	CONSTRAINT "accounts_debt_fields_only_for_debt" CHECK (("accounts"."type" = 'debt') OR ("accounts"."debt_initial_amount" IS NULL AND "accounts"."debt_is_owed_to_me" IS NULL AND "accounts"."debt_due_date" IS NULL)),
	CONSTRAINT "accounts_payment_no_type_specific_fields" CHECK (("accounts"."type" != 'payment') OR ("accounts"."savings_target_amount" IS NULL AND "accounts"."savings_target_date" IS NULL AND "accounts"."debt_initial_amount" IS NULL AND "accounts"."debt_is_owed_to_me" IS NULL AND "accounts"."debt_due_date" IS NULL))
);
--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"type" "attachment_type" NOT NULL,
	"bucket_path" text NOT NULL,
	"mime" varchar(150) NOT NULL,
	"file_name" varchar(500) NOT NULL,
	"file_size" integer NOT NULL,
	"duration" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attachments_bucket_path_not_empty" CHECK (length(trim("attachments"."bucket_path")) > 0),
	CONSTRAINT "attachments_file_size_positive" CHECK ("attachments"."file_size" IS NULL OR "attachments"."file_size" > 0),
	CONSTRAINT "attachments_duration_positive" CHECK ("attachments"."duration" IS NULL OR "attachments"."duration" > 0),
	CONSTRAINT "attachments_voice_has_duration" CHECK ("attachments"."type" != 'voice' OR "attachments"."duration" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"category_id" uuid NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	CONSTRAINT "budgets_positive_amount" CHECK ("budgets"."amount" > 0)
);
--> statement-breakpoint
ALTER TABLE "budgets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"type" "category_type" NOT NULL,
	"parent_id" uuid,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"icon" varchar(50) DEFAULT 'circle' NOT NULL,
	"sort_order" integer DEFAULT 1000 NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_not_empty" CHECK (length(trim("categories"."name")) > 0),
	CONSTRAINT "categories_no_self_parent" CHECK ("categories"."parent_id" IS NULL OR "categories"."parent_id" != "categories"."id")
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "currencies" (
	"code" varchar(3) PRIMARY KEY NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_currency" varchar(3) NOT NULL,
	"quote_currency" varchar(3) NOT NULL,
	"rate" numeric NOT NULL,
	"rate_date" date NOT NULL,
	CONSTRAINT "exchange_rates_positive_rate" CHECK ("exchange_rates"."rate" > 0),
	CONSTRAINT "exchange_rates_different_currencies" CHECK ("exchange_rates"."base_currency" != "exchange_rates"."quote_currency")
);
--> statement-breakpoint
CREATE TABLE "transaction_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"transaction_id" uuid NOT NULL,
	"attachment_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transaction_attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"type" "transaction_type" NOT NULL,
	"account_id" uuid,
	"counter_account_id" uuid,
	"category_id" uuid,
	"amount" numeric(14, 2) NOT NULL,
	"currency_id" varchar(3) NOT NULL,
	"tx_date" date NOT NULL,
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_positive_amount" CHECK ("transactions"."amount" > 0),
	CONSTRAINT "transactions_transfer_different_accounts" CHECK ("transactions"."type" != 'transfer' OR "transactions"."account_id" != "transactions"."counter_account_id"),
	CONSTRAINT "transactions_transfer_has_counter_account" CHECK ("transactions"."type" != 'transfer' OR "transactions"."counter_account_id" IS NOT NULL),
	CONSTRAINT "transactions_non_transfer_no_counter_account" CHECK ("transactions"."type" = 'transfer' OR "transactions"."counter_account_id" IS NULL),
	CONSTRAINT "transactions_date_not_future" CHECK ("transactions"."tx_date" <= CURRENT_DATE)
);
--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"user_id" varchar(50) PRIMARY KEY DEFAULT (auth.user_id()) NOT NULL,
	"default_currency" varchar(3) NOT NULL,
	"first_weekday" smallint DEFAULT 1,
	"locale" varchar(20) DEFAULT 'en-US',
	CONSTRAINT "user_preferences_valid_weekday" CHECK ("user_preferences"."first_weekday" >= 1 AND "user_preferences"."first_weekday" <= 7)
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_currency_id_currencies_code_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_currency_currencies_code_fk" FOREIGN KEY ("currency") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_base_currency_currencies_code_fk" FOREIGN KEY ("base_currency") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_quote_currency_currencies_code_fk" FOREIGN KEY ("quote_currency") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_attachments" ADD CONSTRAINT "transaction_attachments_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_attachments" ADD CONSTRAINT "transaction_attachments_attachment_id_attachments_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_counter_account_id_accounts_id_fk" FOREIGN KEY ("counter_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_currency_id_currencies_code_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_default_currency_currencies_code_fk" FOREIGN KEY ("default_currency") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "accounts_user_archived_idx" ON "accounts" USING btree ("user_id","is_archived");--> statement-breakpoint
CREATE INDEX "accounts_user_type_idx" ON "accounts" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "attachments_user_idx" ON "attachments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "attachments_type_idx" ON "attachments" USING btree ("type");--> statement-breakpoint
CREATE INDEX "attachments_user_type_idx" ON "attachments" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "attachments_created_at_idx" ON "attachments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "budgets_user_idx" ON "budgets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "budgets_category_idx" ON "budgets" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_category_start_end_unq" ON "budgets" USING btree ("category_id","currency","start_date","end_date");--> statement-breakpoint
CREATE INDEX "categories_user_idx" ON "categories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_user_archived_idx" ON "categories" USING btree ("user_id","is_archived");--> statement-breakpoint
CREATE INDEX "categories_user_type_idx" ON "categories" USING btree ("user_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_user_parent_name_unq" ON "categories" USING btree ("user_id","parent_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_rates_base_quote_date_unq" ON "exchange_rates" USING btree ("base_currency","quote_currency","rate_date");--> statement-breakpoint
CREATE INDEX "exchange_rates_base_currency_idx" ON "exchange_rates" USING btree ("base_currency");--> statement-breakpoint
CREATE INDEX "exchange_rates_quote_currency_idx" ON "exchange_rates" USING btree ("quote_currency");--> statement-breakpoint
CREATE UNIQUE INDEX "transaction_attachments_unique" ON "transaction_attachments" USING btree ("transaction_id","attachment_id");--> statement-breakpoint
CREATE INDEX "transaction_attachments_user_idx" ON "transaction_attachments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transaction_attachments_transaction_idx" ON "transaction_attachments" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "transaction_attachments_attachment_idx" ON "transaction_attachments" USING btree ("attachment_id");--> statement-breakpoint
CREATE INDEX "transactions_user_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_account_idx" ON "transactions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "transactions_category_idx" ON "transactions" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "transactions_user_date_idx" ON "transactions" USING btree ("user_id","tx_date");--> statement-breakpoint
CREATE INDEX "transactions_user_type_idx" ON "transactions" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "transactions_date_idx" ON "transactions" USING btree ("tx_date");--> statement-breakpoint
CREATE INDEX "transactions_counter_account_idx" ON "transactions" USING btree ("counter_account_id");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "accounts"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "accounts"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "accounts"."user_id")) WITH CHECK ((select auth.user_id() = "accounts"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "accounts"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "attachments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "attachments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "attachments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "attachments"."user_id")) WITH CHECK ((select auth.user_id() = "attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "attachments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "budgets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "budgets"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "budgets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "budgets"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "budgets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "budgets"."user_id")) WITH CHECK ((select auth.user_id() = "budgets"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "budgets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "budgets"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "categories" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "categories"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "categories" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "categories"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "categories" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "categories"."user_id")) WITH CHECK ((select auth.user_id() = "categories"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "categories" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "categories"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "transaction_attachments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "transaction_attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "transaction_attachments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "transaction_attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "transaction_attachments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "transaction_attachments"."user_id")) WITH CHECK ((select auth.user_id() = "transaction_attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "transaction_attachments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "transaction_attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "transactions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "transactions"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "transactions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "transactions"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "transactions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "transactions"."user_id")) WITH CHECK ((select auth.user_id() = "transactions"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "transactions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "transactions"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "user_preferences" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "user_preferences"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "user_preferences" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "user_preferences"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "user_preferences" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "user_preferences"."user_id")) WITH CHECK ((select auth.user_id() = "user_preferences"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "user_preferences" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "user_preferences"."user_id"));