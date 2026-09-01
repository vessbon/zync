import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    tags: r.many.tags({
      from: r.users.id,
      to: r.tags.userId,
    }),
  },
  tags: {
    user: r.one.users({
      from: r.tags.userId,
      to: r.users.id,
    }),
    timeEntries: r.many.timeEntries({
      from: r.tags.id,
      to: r.timeEntries.tagId,
    }),
  },
  timeEntries: {
    tag: r.one.tags({
      from: r.timeEntries.tagId,
      to: r.tags.id,
    }),
  },
}));
