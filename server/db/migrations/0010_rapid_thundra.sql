ALTER TABLE "attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "user_id" varchar(50) DEFAULT (auth.user_id()) NOT NULL;--> statement-breakpoint
CREATE INDEX "attachments_user_idx" ON "attachments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "attachments_user_type_idx" ON "attachments" USING btree ("user_id","type");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "attachments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "attachments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "attachments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "attachments"."user_id")) WITH CHECK ((select auth.user_id() = "attachments"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "attachments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "attachments"."user_id"));