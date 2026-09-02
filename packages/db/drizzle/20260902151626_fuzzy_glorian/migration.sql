ALTER TABLE "time_entries" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "time_entries" ALTER COLUMN "updated_at" SET NOT NULL;