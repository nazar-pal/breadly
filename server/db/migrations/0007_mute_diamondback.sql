ALTER TABLE "accounts" ADD COLUMN "savings_target_amount" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "savings_target_date" date;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "debt_is_owed_to_me" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "debt_due_date" date;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_positive_target_amount" CHECK ("accounts"."savings_target_amount" IS NULL OR "accounts"."savings_target_amount" > 0);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_savings_fields_only_for_saving" CHECK (("accounts"."type" = 'saving') OR ("accounts"."savings_target_amount" IS NULL AND "accounts"."savings_target_date" IS NULL));--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_debt_fields_only_for_debt" CHECK (("accounts"."type" = 'debt') OR ("accounts"."debt_is_owed_to_me" IS NULL AND "accounts"."debt_due_date" IS NULL));--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_payment_no_type_specific_fields" CHECK (("accounts"."type" != 'payment') OR ("accounts"."savings_target_amount" IS NULL AND "accounts"."savings_target_date" IS NULL AND "accounts"."debt_is_owed_to_me" IS NULL AND "accounts"."debt_due_date" IS NULL));