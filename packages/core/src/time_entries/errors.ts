import { ServiceError } from "@/service-error";

export class TagNotFoundError extends ServiceError {
  constructor() {
    super("Tag does not exist", "TAG_NOT_FOUND");
    this.name = "TagNotFoundError";
  }
}

export class TimeEntryCreationForbiddenError extends ServiceError {
  constructor() {
    super(
      "User cannot create time entry for this tag",
      "TIME_ENTRY_CREATION_FORBIDDEN",
    );
    this.name = "TimeEntryCreationForbiddenError";
  }
}
