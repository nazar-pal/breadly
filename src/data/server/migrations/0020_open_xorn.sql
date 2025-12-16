CREATE TYPE "public"."attachment_status" AS ENUM('pending', 'ready', 'failed');--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "status" "attachment_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "uploaded_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "attachments_status_idx" ON "attachments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "attachments_user_status_idx" ON "attachments" USING btree ("user_id","status");--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_ready_has_uploaded_at" CHECK ("attachments"."status" != 'ready' OR "attachments"."uploaded_at" IS NOT NULL);