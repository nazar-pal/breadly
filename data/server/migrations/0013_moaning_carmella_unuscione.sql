ALTER TABLE "user_preferences" ALTER COLUMN "first_weekday" SET DATA TYPE smallint;--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "first_weekday" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "attachments" ALTER COLUMN "file_size" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "attachments" ALTER COLUMN "duration" SET DATA TYPE integer;