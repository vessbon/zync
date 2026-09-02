import type { Services } from "@repo/core/services";

export function createMockTagService(
  overrides: Partial<Services["tagService"]> = {},
): Services["tagService"] {
  return {
    create: async (_userId, input) => ({
      id: "tag-1",
      name: input.name,
      userId: input.userId,
    }),
    getById: async () => null,
    ...overrides,
  };
}

export function createMockTimeEntryService(
  overrides: Partial<Services["timeEntryService"]> = {},
): Services["timeEntryService"] {
  return {
    create: async (_userId, input) => ({
      id: "entry-1",
      tagId: input.tagId,
      duration: input.duration,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }),
    ...overrides,
  };
}

export function createMockServices(): Services {
  return {
    tagService: createMockTagService(),
    timeEntryService: createMockTimeEntryService(),
  };
}
