ALTER TABLE "currencies" DROP CONSTRAINT "currencies_symbol_not_empty";--> statement-breakpoint
ALTER TABLE "currencies" DROP CONSTRAINT "currencies_name_not_empty";--> statement-breakpoint
ALTER TABLE "currencies" DROP COLUMN "symbol";--> statement-breakpoint
ALTER TABLE "currencies" DROP COLUMN "name";