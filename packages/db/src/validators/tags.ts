import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { tags, timeEntries } from "../schema";

export const tagSelectSchema = createSelectSchema(tags);
export const tagInsertSchema = createInsertSchema(tags);

export type Tag = InferSelectModel<typeof tags>;
export type CreateTagInput = InferInsertModel<typeof tags>;

export const timeEntrySelectSchema = createSelectSchema(timeEntries);
export const timeEntryInsertSchema = createInsertSchema(timeEntries);

export type TimeEntry = InferSelectModel<typeof timeEntries>;
export type CreateTimeEntryInput = InferInsertModel<typeof timeEntries>;
