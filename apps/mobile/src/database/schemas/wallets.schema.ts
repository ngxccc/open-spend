import { index, snakeCase, text } from "drizzle-orm/sqlite-core";
import type { WalletType } from "./enums.schema";
import { fullEntity } from "./helpers.schema";

export const wallets = snakeCase.table(
  "wallets",
  {
    ...fullEntity,
    userId: text(),
    name: text().notNull(),
    type: text().$type<WalletType>().notNull(),
    initialBalance: text().notNull(),
    currency: text().default("VND").notNull(),
    icon: text(),
    color: text(),
  },
  (table) => [
    index("wallets_user_id_idx").on(table.userId),
    index("wallets_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
