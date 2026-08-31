import { integer, snakeCase, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { users } from "./auth";

export const tags = snakeCase.table("tags", {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  name: varchar({ length: 20 }).notNull(),
});

export const time = snakeCase.table("time_entries", {
  id: uuid().defaultRandom().primaryKey(),
  tagId: uuid().references(() => tags.id, {
    onDelete: "cascade",
  }),
  duration: integer(),
  ...timestamps,
});
