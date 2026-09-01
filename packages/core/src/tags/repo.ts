import type { DB } from "@repo/db/client";
import { tags } from "@repo/db/schema";
import type { Tag } from "@repo/db/validators";
import { eq } from "drizzle-orm";

export async function createTag(
  db: DB,
  input: { userId: string; name: string },
): Promise<Tag> {
  const [result] = await db.insert(tags).values(input).returning();

  if (!result) {
    throw new Error("Tag was not created");
  }

  return result;
}

export async function getTag(db: DB, id: string): Promise<Tag | null> {
  const [tag] = await db.select().from(tags).where(eq(tags.id, id));
  return tag || null;
}
