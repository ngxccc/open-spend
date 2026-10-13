import { index, numeric, snakeCase, text, uuid, varchar } from "drizzle-orm/pg-core";
import { walletTypeEnum } from "./enums.schema";
import { fullEntity } from "./helpers.schema";

export const wallets = snakeCase.table(
  "wallets",
  {
    ...fullEntity,
    userId: uuid(),
    name: varchar({ length: 100 }).notNull(),
    type: walletTypeEnum().notNull(),
    initialBalance: numeric({
      precision: 18,
      scale: 4,
    }).notNull(),
    currency: varchar({ length: 10 }).default("VND").notNull(),
    icon: text(),
    color: varchar({ length: 32 }),
  },
  (table) => [
    index("wallets_user_id_idx").on(table.userId),
    index("wallets_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
