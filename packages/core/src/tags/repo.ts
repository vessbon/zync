import type { DB } from "@repo/db/client";
import { tags } from "@repo/db/schema";
import type { CreateTagInput, Tag } from "@repo/db/validators";
import { and, eq } from "drizzle-orm";

export async function createTag(db: DB, input: CreateTagInput): Promise<Tag> {
  const [result] = await db.insert(tags).values(input).returning();

  if (!result) {
    throw new Error("Tag was not created");
  }

  return result;
}

export async function deleteTag(
  db: DB,
  id: string,
  userId: string,
): Promise<void> {
  await db.delete(tags).where(and(eq(tags.id, id), eq(tags.userId, userId)));
}

export async function getTagById(
  db: DB,
  id: string,
  userId: string,
): Promise<Tag | null> {
  const [tag] = await db
    .select()
    .from(tags)
    .where(and(eq(tags.id, id), eq(tags.userId, userId)));

  return tag || null;
}
