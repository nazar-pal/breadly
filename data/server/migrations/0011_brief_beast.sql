ALTER TABLE "transaction_attachments" DROP CONSTRAINT "transaction_attachments_transaction_id_attachment_id_pk";--> statement-breakpoint
ALTER TABLE "transaction_attachments" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "transaction_attachments_unique" ON "transaction_attachments" USING btree ("transaction_id","attachment_id");