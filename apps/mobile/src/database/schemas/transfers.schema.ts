import { index, snakeCase, text } from "drizzle-orm/sqlite-core";
import { fullEntity } from "./helpers.schema";
import { wallets } from "./wallets.schema";

export const transfers = snakeCase.table(
  "transfers",
  {
    ...fullEntity,
    userId: text(),
    fromWalletId: text()
      .references(() => wallets.id, { onDelete: "cascade" })
      .notNull(),
    toWalletId: text()
      .references(() => wallets.id, { onDelete: "cascade" })
      .notNull(),
    amount: text().notNull(),
    fee: text().default("0.0000").notNull(),
    note: text(),
    occurredAt: text().notNull(),
  },
  (table) => [
    index("transfers_user_id_idx").on(table.userId),
    index("transfers_from_wallet_id_idx").on(table.fromWalletId),
    index("transfers_to_wallet_id_idx").on(table.toWalletId),
    index("transfers_occurred_at_idx").on(table.occurredAt),
    index("transfers_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Transfer = typeof transfers.$inferSelect;
export type NewTransfer = typeof transfers.$inferInsert;
