import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";
import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import type { ExtractTablesFromSchema, ExtractTablesWithRelations } from "drizzle-orm";
import * as schema from "./schemas";

export const DATABASE_NAME = "open_spend.db";

export type MobileDrizzleDB = ExpoSQLiteDatabase<
  ExtractTablesWithRelations<Record<string, never>, ExtractTablesFromSchema<typeof schema>>
>;

let expoDbInstance: SQLiteDatabase | undefined;
let drizzleDbInstance: MobileDrizzleDB | undefined;

export function getExpoDatabase(): SQLiteDatabase {
  expoDbInstance ??= openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
  return expoDbInstance;
}

export function getDatabaseClient(): MobileDrizzleDB {
  drizzleDbInstance ??= drizzle(getExpoDatabase(), {
    relations: schema.schemaRelations,
  }) as unknown as MobileDrizzleDB;
  return drizzleDbInstance;
}
