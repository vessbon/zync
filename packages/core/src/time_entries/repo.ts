import type { DB } from "@repo/db/client";
import { timeEntries } from "@repo/db/schema";
import type { CreateTimeEntryInput, TimeEntry } from "@repo/db/validators";

export async function createTimeEntry(
  db: DB,
  input: CreateTimeEntryInput,
): Promise<TimeEntry> {
  const [result] = await db.insert(timeEntries).values(input).returning();

  if (!result) {
    throw new Error("Time entry was not created");
  }

  return result;
}

export async function getTimeEntriesForTag(
  db: DB,
  tagId: string,
): Promise<TimeEntry[]> {
  const entries = db.query.timeEntries.findMany({
    where: {
      id: tagId,
    },
  });

  return entries;
}
