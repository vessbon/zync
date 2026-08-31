import type { CreateTagInput } from "@repo/db/validators";

export function validateTagName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "Tag name cannot be empty" };
  }

  if (name.length > 20) {
    return { isValid: false, error: "Tag name must be 20 characters or less" };
  }

  return { isValid: true };
}

export function normalizeTagInput(input: CreateTagInput): CreateTagInput {
  return {
    ...input,
    name: input.name.trim(),
  };
}

export function canUserCreateTag(
  userId: string,
  input: CreateTagInput,
): boolean {
  return userId === input.userId;
}
