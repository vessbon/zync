import type { DB } from "@repo/db/client";
import type { CreateTagInput, Tag } from "@repo/db/validators";
import { InvalidTagNameError, TagCreationForbiddenError } from "./errors";
import { createTag, deleteTag, getTagById } from "./repo";
import { canUserCreateTag, normalizeTagInput, validateTagName } from "./rules";

export function createTagService(db: DB) {
  return {
    async create(input: CreateTagInput, userId: string): Promise<Tag> {
      const normalizedInput = normalizeTagInput(input);

      const validatedInput = validateTagName(normalizedInput.name);
      if (!validatedInput.isValid) {
        throw new InvalidTagNameError(
          validatedInput.error ?? "Invalid tag name",
        );
      }

      if (!canUserCreateTag(userId, normalizedInput)) {
        throw new TagCreationForbiddenError();
      }

      return createTag(db, normalizedInput);
    },

    async delete(id: string, userId: string): Promise<void> {
      const normalizedId = id.trim();
      return deleteTag(db, normalizedId, userId);
    },

    async getById(id: string, userId: string): Promise<Tag | null> {
      const normalizedId = id.trim();
      return getTagById(db, normalizedId, userId);
    },
  };
}
