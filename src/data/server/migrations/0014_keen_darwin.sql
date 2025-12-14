ALTER TABLE "budgets" ADD COLUMN "name" varchar(100);--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "description" varchar(1000);--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "budgets_user_archived_idx" ON "budgets" USING btree ("user_id","is_archived");