import type { createTagService } from "@repo/core/tags";

export type Services = {
  tagService: ReturnType<typeof createTagService>;
};
