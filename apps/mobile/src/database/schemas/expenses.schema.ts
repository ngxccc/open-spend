import { index, integer, snakeCase, text } from "drizzle-orm/sqlite-core";
import { categories } from "./categories.schema";
import { fullEntity } from "./helpers.schema";
import { wallets } from "./wallets.schema";

export const expenses = snakeCase.table(
  "expenses",
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
    index("expenses_user_id_idx").on(table.userId),
    index("expenses_wallet_id_idx").on(table.walletId),
    index("expenses_category_id_idx").on(table.categoryId),
    index("expenses_occurred_at_idx").on(table.occurredAt),
    index("expenses_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
