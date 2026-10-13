import {
  date,
  index,
  numeric,
  smallint,
  snakeCase,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.schema";
import { fullEntity } from "./helpers.schema";
import { wallets } from "./wallets.schema";

export const incomes = snakeCase.table(
  "incomes",
  {
    ...fullEntity,
    userId: uuid(),
    walletId: uuid()
      .references(() => wallets.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: uuid()
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    amount: numeric({ precision: 18, scale: 4 }).notNull(),
    title: varchar({ length: 200 }).notNull(),
    note: text(),
    occurredAt: date().notNull(),
    minuteOfDay: smallint(),
  },
  (table) => [
    index("incomes_user_id_idx").on(table.userId),
    index("incomes_wallet_id_idx").on(table.walletId),
    index("incomes_category_id_idx").on(table.categoryId),
    index("incomes_occurred_at_idx").on(table.occurredAt),
    index("incomes_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Income = typeof incomes.$inferSelect;
export type NewIncome = typeof incomes.$inferInsert;
