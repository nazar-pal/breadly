CREATE TYPE "public"."category_type" AS ENUM('expense', 'income');--> statement-breakpoint
CREATE TYPE "public"."budget_period" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('saving', 'payment', 'debt');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('expense', 'income', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."attachment_status" AS ENUM('pending', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."attachment_type" AS ENUM('receipt', 'voice');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"type" "account_type" NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"currency_id" varchar(3) DEFAULT 'USD' NOT NULL,
	"balance" bigint DEFAULT 0 NOT NULL,
	"savings_target_amount" bigint,
	"savings_target_date" date,
	"debt_initial_amount" bigint,
	"debt_due_date" date,
	"is_archived" boolean DEFAULT false NOT NULL,
	"archived_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"server_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_name_not_empty" CHECK (length(trim("accounts"."name")) > 0),
	CONSTRAINT "accounts_max_balance" CHECK ("accounts"."balance" <= 9007199254740991),
	CONSTRAINT "accounts_positive_target_amount" CHECK ("accounts"."savings_target_amount" IS NULL OR "accounts"."savings_target_amount" > 0),
	CONSTRAINT "accounts_max_target_amount" CHECK ("accounts"."savings_target_amount" IS NULL OR "accounts"."savings_target_amount" <= 9007199254740991),
	CONSTRAINT "accounts_positive_debt_initial_amount" CHECK ("accounts"."debt_initial_amount" IS NULL OR "accounts"."debt_initial_amount" > 0),
	CONSTRAINT "accounts_max_debt_initial_amount" CHECK ("accounts"."debt_initial_amount" IS NULL OR "accounts"."debt_initial_amount" <= 9007199254740991),
	CONSTRAINT "accounts_savings_fields_only_for_saving" CHECK (("accounts"."type" = 'saving') OR ("accounts"."savings_target_amount" IS NULL AND "accounts"."savings_target_date" IS NULL)),
	CONSTRAINT "accounts_debt_fields_only_for_debt" CHECK (("accounts"."type" = 'debt') OR ("accounts"."debt_initial_amount" IS NULL AND "accounts"."debt_due_date" IS NULL)),
	CONSTRAINT "accounts_payment_no_type_specific_fields" CHECK (("accounts"."type" != 'payment') OR ("accounts"."savings_target_amount" IS NULL AND "accounts"."savings_target_date" IS NULL AND "accounts"."debt_initial_amount" IS NULL AND "accounts"."debt_due_date" IS NULL))
);
--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"type" "attachment_type" NOT NULL,
	"status" "attachment_status" DEFAULT 'pending' NOT NULL,
	"bucket_path" text NOT NULL,
	"mime" varchar(150) NOT NULL,
	"file_name" varchar(500) NOT NULL,
	"file_size" integer NOT NULL,
	"duration" integer,
	"uploaded_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"server_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attachments_bucket_path_not_empty" CHECK (length(trim("attachments"."bucket_path")) > 0),
	CONSTRAINT "attachments_mime_not_empty" CHECK (length(trim("attachments"."mime")) > 0),
	CONSTRAINT "attachments_file_name_not_empty" CHECK (length(trim("attachments"."file_name")) > 0),
	CONSTRAINT "attachments_file_size_positive" CHECK ("attachments"."file_size" > 0),
	CONSTRAINT "attachments_duration_positive" CHECK ("attachments"."duration" IS NULL OR "attachments"."duration" > 0),
	CONSTRAINT "attachments_voice_has_duration" CHECK ("attachments"."type" != 'voice' OR "attachments"."duration" IS NOT NULL),
	CONSTRAINT "attachments_ready_has_uploaded_at" CHECK ("attachments"."status" != 'ready' OR "attachments"."uploaded_at" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"category_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"currency_id" varchar(3) NOT NULL,
	"period" "budget_period" NOT NULL,
	"budget_year" smallint NOT NULL,
	"budget_month" smallint,
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"server_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "budgets_category_currency_period_unq" UNIQUE NULLS NOT DISTINCT("category_id","currency_id","budget_year","budget_month"),
	CONSTRAINT "budgets_positive_amount" CHECK ("budgets"."amount" > 0),
	CONSTRAINT "budgets_max_amount" CHECK ("budgets"."amount" <= 9007199254740991),
	CONSTRAINT "budgets_valid_year" CHECK ("budgets"."budget_year" >= 1970 AND "budgets"."budget_year" <= 2100),
	CONSTRAINT "budgets_monthly_has_month" CHECK ("budgets"."period" != 'monthly' OR ("budgets"."budget_month" >= 1 AND "budgets"."budget_month" <= 12)),
	CONSTRAINT "budgets_yearly_no_month" CHECK ("budgets"."period" != 'yearly' OR "budgets"."budget_month" IS NULL)
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
	"archived_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"server_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_user_parent_name_unq" UNIQUE NULLS NOT DISTINCT("user_id","parent_id","name"),
	CONSTRAINT "categories_name_not_empty" CHECK (length(trim("categories"."name")) > 0),
	CONSTRAINT "categories_no_self_parent" CHECK ("categories"."parent_id" IS NULL OR "categories"."parent_id" != "categories"."id")
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "currencies" (
	"code" varchar(3) PRIMARY KEY NOT NULL,
	CONSTRAINT "currencies_code_format" CHECK ("currencies"."code" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"start_date" date,
	"end_date" date,
	"is_archived" boolean DEFAULT false NOT NULL,
	"archived_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"server_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_name_not_empty" CHECK (length(trim("events"."name")) > 0),
	CONSTRAINT "events_valid_date_range" CHECK ("events"."start_date" IS NULL OR "events"."end_date" IS NULL OR "events"."end_date" >= "events"."start_date")
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_currency" varchar(3) NOT NULL,
	"quote_currency" varchar(3) NOT NULL,
	"rate" double precision NOT NULL,
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
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"server_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
	"event_id" uuid,
	"amount" bigint NOT NULL,
	"currency_id" varchar(3) NOT NULL,
	"tx_date" date NOT NULL,
	"notes" varchar(1000),
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"server_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_positive_amount" CHECK ("transactions"."amount" > 0),
	CONSTRAINT "transactions_max_amount" CHECK ("transactions"."amount" <= 9007199254740991),
	CONSTRAINT "transactions_transfer_different_accounts" CHECK ("transactions"."type" != 'transfer' OR "transactions"."account_id" != "transactions"."counter_account_id"),
	CONSTRAINT "transactions_transfer_has_account" CHECK ("transactions"."type" != 'transfer' OR "transactions"."account_id" IS NOT NULL),
	CONSTRAINT "transactions_transfer_has_counter_account" CHECK ("transactions"."type" != 'transfer' OR "transactions"."counter_account_id" IS NOT NULL),
	CONSTRAINT "transactions_non_transfer_no_counter_account" CHECK ("transactions"."type" = 'transfer' OR "transactions"."counter_account_id" IS NULL),
	CONSTRAINT "transactions_income_expense_has_category" CHECK ("transactions"."type" = 'transfer' OR "transactions"."category_id" IS NOT NULL),
	CONSTRAINT "transactions_transfer_no_category" CHECK ("transactions"."type" != 'transfer' OR "transactions"."category_id" IS NULL)
);
--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"user_id" varchar(50) PRIMARY KEY DEFAULT (auth.user_id()) NOT NULL,
	"default_currency" varchar(3),
	"first_weekday" smallint DEFAULT 1,
	"locale" varchar(20) DEFAULT 'en-US',
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"server_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"server_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_valid_weekday" CHECK ("user_preferences"."first_weekday" >= 1 AND "user_preferences"."first_weekday" <= 7),
	CONSTRAINT "user_preferences_valid_locale" CHECK ("user_preferences"."locale" IS NULL OR length("user_preferences"."locale") >= 2)
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_currency_id_currencies_code_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_currency_id_currencies_code_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_base_currency_currencies_code_fk" FOREIGN KEY ("base_currency") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_quote_currency_currencies_code_fk" FOREIGN KEY ("quote_currency") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_attachments" ADD CONSTRAINT "transaction_attachments_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_attachments" ADD CONSTRAINT "transaction_attachments_attachment_id_attachments_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_counter_account_id_accounts_id_fk" FOREIGN KEY ("counter_account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_currency_id_currencies_code_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_default_currency_currencies_code_fk" FOREIGN KEY ("default_currency") REFERENCES "public"."currencies"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "attachments_user_idx" ON "attachments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "budgets_user_idx" ON "budgets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "budgets_category_idx" ON "budgets" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "categories_user_idx" ON "categories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "events_user_idx" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exchange_rates_base_quote_date_unq" ON "exchange_rates" USING btree ("base_currency","quote_currency","rate_date");--> statement-breakpoint
CREATE INDEX "exchange_rates_base_currency_idx" ON "exchange_rates" USING btree ("base_currency");--> statement-breakpoint
CREATE INDEX "exchange_rates_quote_currency_idx" ON "exchange_rates" USING btree ("quote_currency");--> statement-breakpoint
CREATE INDEX "exchange_rates_rate_date_idx" ON "exchange_rates" USING btree ("rate_date");--> statement-breakpoint
CREATE UNIQUE INDEX "transaction_attachments_unique" ON "transaction_attachments" USING btree ("transaction_id","attachment_id");--> statement-breakpoint
CREATE INDEX "transaction_attachments_user_idx" ON "transaction_attachments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transaction_attachments_transaction_idx" ON "transaction_attachments" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "transaction_attachments_attachment_idx" ON "transaction_attachments" USING btree ("attachment_id");--> statement-breakpoint
CREATE INDEX "transactions_user_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_account_idx" ON "transactions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "transactions_counter_account_idx" ON "transactions" USING btree ("counter_account_id");--> statement-breakpoint
CREATE INDEX "transactions_category_idx" ON "transactions" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "transactions_event_idx" ON "transactions" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "transactions_date_idx" ON "transactions" USING btree ("tx_date");--> statement-breakpoint
CREATE INDEX "transactions_type_idx" ON "transactions" USING btree ("type");--> statement-breakpoint
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
CREATE POLICY "crud-authenticated-policy-select" ON "events" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "events"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "events" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "events"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "events" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "events"."user_id")) WITH CHECK ((select auth.user_id() = "events"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "events" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "events"."user_id"));--> statement-breakpoint
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