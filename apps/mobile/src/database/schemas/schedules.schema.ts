import { index, snakeCase, text } from "drizzle-orm/sqlite-core";
import { categories } from "./categories.schema";
import type { ScheduleExecutionMode, TransactionType } from "./enums.schema";
import { activeStatus, fullEntity } from "./helpers.schema";
import { wallets } from "./wallets.schema";

export const schedules = snakeCase.table(
  "schedules",
  {
    ...fullEntity,
    ...activeStatus,
    userId: text(),
    walletId: text()
      .references(() => wallets.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: text()
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    type: text().$type<TransactionType>().notNull(),
    amount: text().notNull(),
    title: text().notNull(),
    cronRule: text().notNull(),
    executionMode: text().$type<ScheduleExecutionMode>().notNull(),
    lastExecutedAt: text(),
  },
  (table) => [
    index("schedules_user_id_idx").on(table.userId),
    index("schedules_wallet_id_idx").on(table.walletId),
    index("schedules_category_id_idx").on(table.categoryId),
    index("schedules_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;
