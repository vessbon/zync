import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { authRelations } from "./schema";

export type Database = ReturnType<typeof createDb>;

export function createDb(url: string) {
  const client = postgres(url, { prepare: false });
  return drizzle({
    client,
    relations: { ...authRelations },
  });
}
