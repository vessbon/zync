import { ServiceError } from "../service-error";

export class InvalidTagNameError extends ServiceError {
  constructor(message = "Invalid tag name") {
    super(message, "INVALID_TAG_NAME");
    this.name = "InvalidTagNameError";
  }
}

export class TagCreationForbiddenError extends ServiceError {
  constructor() {
    super("User cannot create tag for this user", "TAG_CREATION_FORBIDDEN");
    this.name = "TagCreationForbiddenError";
  }
}
