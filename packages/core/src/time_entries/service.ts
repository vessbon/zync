import type { DB } from "@repo/db/client";
import type { CreateTimeEntryInput, TimeEntry } from "@repo/db/validators";
import { getTagById } from "../tags/repo";
import { TagNotFoundError, TimeEntryCreationForbiddenError } from "./errors";
import { createTimeEntry } from "./repo";

export function createTimeEntryService(db: DB) {
  return {
    create: async (
      input: CreateTimeEntryInput,
      userId: string,
    ): Promise<TimeEntry> => {
      const tag = await getTagById(db, input.tagId, userId);

      if (!tag) {
        throw new TagNotFoundError();
      }

      if (tag.userId !== userId) {
        throw new TimeEntryCreationForbiddenError();
      }

      return createTimeEntry(db, input);
    },
  };
}
