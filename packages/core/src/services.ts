import type { DB } from "@repo/db/client";
import { createTagService } from "./tags";
import { createTimeEntryService } from "./time_entries";

export type Services = {
  tagService: ReturnType<typeof createTagService>;
  timeEntryService: ReturnType<typeof createTimeEntryService>;
};

export function createServices(db: DB): Services {
  return {
    tagService: createTagService(db),
    timeEntryService: createTimeEntryService(db),
  };
}
