import { z } from "zod";

// ── Wallet Domain ──
export const WalletTypeSchema = z.enum(["CASH", "BANK", "E_WALLET", "CREDIT"]);
export type WalletType = z.infer<typeof WalletTypeSchema>;

export const WalletSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  name: z.string().min(1).max(100),
  type: WalletTypeSchema,
  initialBalance: z
    .string()
    .regex(/^-?\d+(\.\d{1,4})?$/, "Must be exact fixed-point decimal string"),
  currency: z.string().default("VND"),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});
export type Wallet = z.infer<typeof WalletSchema>;

// ── Category Domain ──
export const CategoryTypeSchema = z.enum(["EXPENSE", "INCOME", "BOTH"]);
export type CategoryType = z.infer<typeof CategoryTypeSchema>;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  name: z.string().min(1).max(100),
  type: CategoryTypeSchema,
  parentId: z.string().uuid().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

// ── Expense & Income Domain ──
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  walletId: z.string().uuid(),
  categoryId: z.string().uuid(),
  amount: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be non-negative fixed-point decimal string"),
  title: z.string().min(1).max(200),
  note: z.string().max(1000).nullable().optional(),
  occurredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  minuteOfDay: z.number().int().min(0).max(1439).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

// ── Transfer Domain ──
export const TransferSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  fromWalletId: z.string().uuid(),
  toWalletId: z.string().uuid(),
  amount: z.string().regex(/^\d+(\.\d{1,4})?$/),
  fee: z
    .string()
    .regex(/^\d+(\.\d{1,4})?$/)
    .default("0.00"),
  note: z.string().max(1000).nullable().optional(),
  occurredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});
export type Transfer = z.infer<typeof TransferSchema>;

// ── Schedule Domain ──
export const ScheduleExecutionModeSchema = z.enum(["AUTO_POST", "CONFIRM_PROMPT"]);
export type ScheduleExecutionMode = z.infer<typeof ScheduleExecutionModeSchema>;

export const ScheduleSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  walletId: z.string().uuid(),
  categoryId: z.string().uuid(),
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.string().regex(/^\d+(\.\d{1,4})?$/),
  title: z.string().min(1).max(200),
  cronRule: z.string().min(1),
  executionMode: ScheduleExecutionModeSchema,
  isActive: z.boolean().default(true),
  lastExecutedAt: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});
export type Schedule = z.infer<typeof ScheduleSchema>;

// ── Sync Engine Contracts ──
export const SyncMutationSchema = z.object({
  id: z.number().int().optional(),
  entity: z.enum(["wallet", "expense", "income", "category", "transfer", "schedule"]),
  entityId: z.string().uuid(),
  operation: z.enum(["CREATE", "UPDATE", "DELETE"]),
  payload: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  attempts: z.number().int().default(0),
});
export type SyncMutation = z.infer<typeof SyncMutationSchema>;

export const SyncPushPayloadSchema = z.object({
  mutations: z.array(SyncMutationSchema),
});
export type SyncPushPayload = z.infer<typeof SyncPushPayloadSchema>;

export const SyncPullResponseSchema = z.object({
  serverTimestamp: z.string().datetime(),
  wallets: z.array(WalletSchema),
  categories: z.array(CategorySchema),
  expenses: z.array(TransactionSchema),
  incomes: z.array(TransactionSchema),
  transfers: z.array(TransferSchema),
  schedules: z.array(ScheduleSchema),
});
export type SyncPullResponse = z.infer<typeof SyncPullResponseSchema>;
