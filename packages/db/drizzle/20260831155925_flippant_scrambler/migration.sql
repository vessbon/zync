ALTER TABLE "tags" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_name_unique" UNIQUE("user_id","name");--> statement-breakpoint
CREATE INDEX "time_entries_tag_id_idx" ON "time_entries" ("tag_id");--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;