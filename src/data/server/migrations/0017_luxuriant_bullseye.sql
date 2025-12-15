CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"start_date" date,
	"end_date" date,
	"is_archived" boolean DEFAULT false NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "events_valid_date_range" CHECK ("events"."start_date" IS NULL OR "events"."end_date" IS NULL OR "events"."end_date" >= "events"."start_date")
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "attachments" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transaction_attachments" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "event_id" uuid;--> statement-breakpoint
CREATE INDEX "events_user_idx" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "events_user_archived_idx" ON "events" USING btree ("user_id","is_archived");--> statement-breakpoint
CREATE INDEX "events_start_date_idx" ON "events" USING btree ("start_date");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "transactions_event_idx" ON "transactions" USING btree ("event_id");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "events" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "events"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "events" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "events"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "events" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "events"."user_id")) WITH CHECK ((select auth.user_id() = "events"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "events" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "events"."user_id"));