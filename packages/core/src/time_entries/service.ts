import type { DB } from "@repo/db/client";
import type { CreateTimeEntryInput, TimeEntry } from "@repo/db/validators";
import { getTagById } from "@/tags/repo";
import { createTimeEntry } from "./repo";

export function createTimeEntryService(db: DB) {
  return {
    create: async (
      userId: string,
      input: CreateTimeEntryInput,
    ): Promise<TimeEntry> => {
      const tag = await getTagById(db, input.tagId);

      if (!tag) {
        throw new Error("Tag does not exist");
      }

      if (tag.userId !== userId) {
        throw new Error("User cannot create time entry for this tag");
      }

      return createTimeEntry(db, input);
    },
  };
}
