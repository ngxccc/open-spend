import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { ExtractTablesFromSchema, ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzleNodePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/env";
import * as schema from "./schemas";

export type SchemaRelations = ExtractTablesWithRelations<
  Record<string, never>,
  ExtractTablesFromSchema<typeof schema>
>;

export type DrizzleNeonDB = NeonHttpDatabase<SchemaRelations>;
export type DrizzleNodePgDB = NodePgDatabase<SchemaRelations>;
export type DrizzleDB = DrizzleNodePgDB;

let dbInstance: DrizzleDB | undefined;

export function createDatabaseClient(): DrizzleDB {
  if (dbInstance) {
    return dbInstance;
  }

  if (env.DB_URL) {
    const sqlClient: NeonQueryFunction<boolean, boolean> = neon(env.DB_URL);
    dbInstance = drizzleNeon({
      client: sqlClient,
      relations: schema.schemaRelations,
    }) as unknown as DrizzleDB;
    return dbInstance;
  }

  const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });

  dbInstance = drizzleNodePg({
    client: pool,
    relations: schema.schemaRelations,
  });

  return dbInstance;
}
