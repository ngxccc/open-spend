export const WALLET_TYPES = ["CASH", "BANK", "E_WALLET", "CREDIT"] as const;
export type WalletType = (typeof WALLET_TYPES)[number];

export const CATEGORY_TYPES = ["EXPENSE", "INCOME", "BOTH"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export const TRANSACTION_TYPES = ["EXPENSE", "INCOME"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const SCHEDULE_EXECUTION_MODES = ["AUTO_POST", "CONFIRM_PROMPT"] as const;
export type ScheduleExecutionMode = (typeof SCHEDULE_EXECUTION_MODES)[number];

export const SYNC_MUTATION_TYPES = ["CREATE", "UPDATE", "DELETE"] as const;
export type SyncMutationType = (typeof SYNC_MUTATION_TYPES)[number];

export const SYNC_QUEUE_STATUSES = ["PENDING", "SYNCING", "FAILED"] as const;
export type SyncQueueStatus = (typeof SYNC_QUEUE_STATUSES)[number];
