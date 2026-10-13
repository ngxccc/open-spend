import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { ExtractTablesFromSchema, ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { env } from "@/env";
import * as schema from "./schemas";

export type DrizzleDB = NeonHttpDatabase<
  ExtractTablesWithRelations<Record<string, never>, ExtractTablesFromSchema<typeof schema>>
>;

let sqlClient: NeonQueryFunction<boolean, boolean> | undefined;

export function createDatabaseClient(): DrizzleDB {
  if (!sqlClient) {
    if (!env.DB_URL) {
      throw new Error("DB_URL is not configured in environment");
    }
    sqlClient = neon(env.DB_URL);
  }

  return drizzle({
    client: sqlClient,
    relations: schema.schemaRelations,
  }) as unknown as DrizzleDB;
}
