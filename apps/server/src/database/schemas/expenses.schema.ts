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

export const expenses = snakeCase.table(
  "expenses",
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
    index("expenses_user_id_idx").on(table.userId),
    index("expenses_wallet_id_idx").on(table.walletId),
    index("expenses_category_id_idx").on(table.categoryId),
    index("expenses_occurred_at_idx").on(table.occurredAt),
    index("expenses_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
