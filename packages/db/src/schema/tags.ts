import {
  index,
  integer,
  snakeCase,
  text,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { users } from "./auth";

export const tags = snakeCase.table(
  "tags",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: text()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    name: varchar({ length: 20 }).notNull(),
  },
  (table) => [unique().on(table.userId, table.name)],
);

export const timeEntries = snakeCase.table(
  "time_entries",
  {
    id: uuid().defaultRandom().primaryKey(),
    tagId: uuid().references(() => tags.id, {
      onDelete: "cascade",
    }),
    duration: integer(),
    ...timestamps,
  },
  (table) => [index("time_entries_tag_id_idx").on(table.tagId)],
);
