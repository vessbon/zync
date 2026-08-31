import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { tags } from "../schema";

export const tagSelectSchema = createSelectSchema(tags);
export const tagInsertSchema = createInsertSchema(tags);

export type Tag = InferSelectModel<typeof tags>;
export type CreateTagInput = InferInsertModel<typeof tags>;
