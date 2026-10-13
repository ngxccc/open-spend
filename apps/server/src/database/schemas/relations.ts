import { defineRelations } from "drizzle-orm";
import { categories } from "./categories.schema";
import { expenses } from "./expenses.schema";
import { incomes } from "./incomes.schema";
import { schedules } from "./schedules.schema";
import { transfers } from "./transfers.schema";
import { wallets } from "./wallets.schema";

export const schemaRelations = defineRelations(
  {
    wallets,
    categories,
    expenses,
    incomes,
    transfers,
    schedules,
  },
  (r) => ({
    wallets: {
      expenses: r.many.expenses({
        from: r.wallets.id,
        to: r.expenses.walletId,
      }),
      incomes: r.many.incomes({
        from: r.wallets.id,
        to: r.incomes.walletId,
      }),
      transfersFrom: r.many.transfers({
        from: r.wallets.id,
        to: r.transfers.fromWalletId,
      }),
      transfersTo: r.many.transfers({
        from: r.wallets.id,
        to: r.transfers.toWalletId,
      }),
      schedules: r.many.schedules({
        from: r.wallets.id,
        to: r.schedules.walletId,
      }),
    },

    categories: {
      parent: r.one.categories({
        from: r.categories.parentId,
        to: r.categories.id,
        optional: true,
      }),
      children: r.many.categories({
        from: r.categories.id,
        to: r.categories.parentId,
      }),
      expenses: r.many.expenses({
        from: r.categories.id,
        to: r.expenses.categoryId,
      }),
      incomes: r.many.incomes({
        from: r.categories.id,
        to: r.incomes.categoryId,
      }),
      schedules: r.many.schedules({
        from: r.categories.id,
        to: r.schedules.categoryId,
      }),
    },

    expenses: {
      wallet: r.one.wallets({
        from: r.expenses.walletId,
        to: r.wallets.id,
        optional: false,
      }),
      category: r.one.categories({
        from: r.expenses.categoryId,
        to: r.categories.id,
        optional: false,
      }),
    },

    incomes: {
      wallet: r.one.wallets({
        from: r.incomes.walletId,
        to: r.wallets.id,
        optional: false,
      }),
      category: r.one.categories({
        from: r.incomes.categoryId,
        to: r.categories.id,
        optional: false,
      }),
    },

    transfers: {
      fromWallet: r.one.wallets({
        from: r.transfers.fromWalletId,
        to: r.wallets.id,
        optional: false,
      }),
      toWallet: r.one.wallets({
        from: r.transfers.toWalletId,
        to: r.wallets.id,
        optional: false,
      }),
    },

    schedules: {
      wallet: r.one.wallets({
        from: r.schedules.walletId,
        to: r.wallets.id,
        optional: false,
      }),
      category: r.one.categories({
        from: r.schedules.categoryId,
        to: r.categories.id,
        optional: false,
      }),
    },
  }),
);
