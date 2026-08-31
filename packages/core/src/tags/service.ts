import type { DB } from "@repo/db/client";
import type { CreateTagInput, Tag } from "@repo/db/validators";
import { createTag } from "./repo";
import { canUserCreateTag, normalizeTagInput, validateTagName } from "./rules";

export function createTagService(db: DB) {
  return {
    async create(userId: string, input: CreateTagInput): Promise<Tag> {
      const normalizedInput = normalizeTagInput(input);

      const validatedInput = validateTagName(normalizedInput.name);
      if (!validatedInput.isValid) {
        throw new Error(validatedInput.error || "Invalid tag name");
      }

      if (!canUserCreateTag(userId, normalizedInput)) {
        throw new Error("User cannot create tag for this user");
      }

      const result = await createTag(db, normalizedInput);

      return result;
    },
  };
}
