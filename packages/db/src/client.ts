import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { relations } from "./relations";
import { authRelations } from "./schema/auth";

export type Database = ReturnType<typeof createDb>;

export function createDb(url: string) {
  const client = postgres(url, { prepare: false });
  return drizzle({
    client,
    relations: { ...relations, ...authRelations },
  });
}

export type DB = ReturnType<typeof createDb>;
