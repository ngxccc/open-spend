import { pgEnum } from "drizzle-orm/pg-core";

export const walletTypeEnum = pgEnum("wallet_type", ["CASH", "BANK", "E_WALLET", "CREDIT"]);
export type WalletType = (typeof walletTypeEnum.enumValues)[number];

export const categoryTypeEnum = pgEnum("category_type", ["EXPENSE", "INCOME", "BOTH"]);
export type CategoryType = (typeof categoryTypeEnum.enumValues)[number];

export const transactionTypeEnum = pgEnum("transaction_type", ["EXPENSE", "INCOME"]);
export type TransactionType = (typeof transactionTypeEnum.enumValues)[number];

export const scheduleExecutionModeEnum = pgEnum("schedule_execution_mode", [
  "AUTO_POST",
  "CONFIRM_PROMPT",
]);
export type ScheduleExecutionMode = (typeof scheduleExecutionModeEnum.enumValues)[number];

export const syncMutationTypeEnum = pgEnum("sync_mutation_type", ["CREATE", "UPDATE", "DELETE"]);
export type SyncMutationType = (typeof syncMutationTypeEnum.enumValues)[number];

export const syncQueueStatusEnum = pgEnum("sync_queue_status", ["PENDING", "SYNCING", "FAILED"]);
export type SyncQueueStatus = (typeof syncQueueStatusEnum.enumValues)[number];
