import type { DB } from "@repo/db/client";
import { tags } from "@repo/db/schema";
import type { CreateTagInput, Tag } from "@repo/db/validators";
import { eq } from "drizzle-orm";

export async function createTag(db: DB, input: CreateTagInput): Promise<Tag> {
  const [result] = await db.insert(tags).values(input).returning();

  if (!result) {
    throw new Error("Tag was not created");
  }

  return result;
}

export async function deleteTag(db: DB, id: string): Promise<void> {
  await db.delete(tags).where(eq(tags.id, id));
}

export async function getTagById(db: DB, id: string): Promise<Tag | null> {
  const [tag] = await db.select().from(tags).where(eq(tags.id, id));
  return tag || null;
}
