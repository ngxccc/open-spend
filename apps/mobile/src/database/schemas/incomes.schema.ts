import { index, integer, snakeCase, text } from "drizzle-orm/sqlite-core";
import { categories } from "./categories.schema";
import { fullEntity } from "./helpers.schema";
import { wallets } from "./wallets.schema";

export const incomes = snakeCase.table(
  "incomes",
  {
    ...fullEntity,
    userId: text(),
    walletId: text()
      .references(() => wallets.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: text()
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    amount: text().notNull(),
    title: text().notNull(),
    note: text(),
    occurredAt: text().notNull(),
    minuteOfDay: integer(),
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
