import type { createTimeEntryService } from "@repo/core/core";
import type { createTagService } from "@repo/core/tags";

export type Services = {
  tagService: ReturnType<typeof createTagService>;
  timeEntryService: ReturnType<typeof createTimeEntryService>;
};
