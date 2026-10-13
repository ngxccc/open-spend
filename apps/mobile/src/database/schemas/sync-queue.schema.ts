import { index, integer, snakeCase, text } from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid";
import type { SyncMutationType, SyncQueueStatus } from "./enums.schema";

export const syncQueue = snakeCase.table(
  "sync_queue",
  {
    id: text().primaryKey().$defaultFn(uuidv7),
    entity: text().notNull(),
    entityId: text().notNull(),
    mutationType: text().$type<SyncMutationType>().notNull(),
    payload: text().notNull(),
    status: text().$type<SyncQueueStatus>().default("PENDING").notNull(),
    attempts: integer().default(0).notNull(),
    lastError: text(),
    createdAt: integer({ mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() /* @__PURE__ */ => new Date()),
    processedAt: integer({ mode: "timestamp_ms" }),
  },
  (table) => [
    index("sync_queue_status_created_at_idx").on(table.status, table.createdAt),
    index("sync_queue_entity_idx").on(table.entity, table.entityId),
  ],
);

export type SyncQueue = typeof syncQueue.$inferSelect;
export type NewSyncQueue = typeof syncQueue.$inferInsert;
