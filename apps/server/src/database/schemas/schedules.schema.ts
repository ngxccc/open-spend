import { date, index, numeric, snakeCase, uuid, varchar } from "drizzle-orm/pg-core";
import { categories } from "./categories.schema";
import { scheduleExecutionModeEnum, transactionTypeEnum } from "./enums.schema";
import { activeStatus, fullEntity } from "./helpers.schema";
import { wallets } from "./wallets.schema";

export const schedules = snakeCase.table(
  "schedules",
  {
    ...fullEntity,
    ...activeStatus,
    userId: uuid(),
    walletId: uuid()
      .references(() => wallets.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: uuid()
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    type: transactionTypeEnum().notNull(),
    amount: numeric({ precision: 18, scale: 4 }).notNull(),
    title: varchar({ length: 200 }).notNull(),
    cronRule: varchar({ length: 100 }).notNull(),
    executionMode: scheduleExecutionModeEnum().notNull(),
    lastExecutedAt: date(),
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
