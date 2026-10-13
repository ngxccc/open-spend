CREATE TYPE "category_type" AS ENUM('EXPENSE', 'INCOME', 'BOTH');--> statement-breakpoint
CREATE TYPE "schedule_execution_mode" AS ENUM('AUTO_POST', 'CONFIRM_PROMPT');--> statement-breakpoint
CREATE TYPE "sync_mutation_type" AS ENUM('CREATE', 'UPDATE', 'DELETE');--> statement-breakpoint
CREATE TYPE "sync_queue_status" AS ENUM('PENDING', 'SYNCING', 'FAILED');--> statement-breakpoint
CREATE TYPE "transaction_type" AS ENUM('EXPENSE', 'INCOME');--> statement-breakpoint
CREATE TYPE "wallet_type" AS ENUM('CASH', 'BANK', 'E_WALLET', 'CREDIT');--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" uuid,
	"name" varchar(100) NOT NULL,
	"type" "wallet_type" NOT NULL,
	"initial_balance" numeric(18,4) NOT NULL,
	"currency" varchar(10) DEFAULT 'VND' NOT NULL,
	"icon" text,
	"color" varchar(32)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" uuid,
	"name" varchar(100) NOT NULL,
	"type" "category_type" NOT NULL,
	"parent_id" uuid,
	"icon" varchar(64),
	"color" varchar(32)
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" uuid,
	"wallet_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"amount" numeric(18,4) NOT NULL,
	"title" varchar(200) NOT NULL,
	"note" text,
	"occurred_at" date NOT NULL,
	"minute_of_day" smallint
);
--> statement-breakpoint
CREATE TABLE "incomes" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" uuid,
	"wallet_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"amount" numeric(18,4) NOT NULL,
	"title" varchar(200) NOT NULL,
	"note" text,
	"occurred_at" date NOT NULL,
	"minute_of_day" smallint
);
--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" uuid,
	"from_wallet_id" uuid NOT NULL,
	"to_wallet_id" uuid NOT NULL,
	"amount" numeric(18,4) NOT NULL,
	"fee" numeric(18,4) DEFAULT '0.0000' NOT NULL,
	"note" text,
	"occurred_at" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"user_id" uuid,
	"wallet_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(18,4) NOT NULL,
	"title" varchar(200) NOT NULL,
	"cron_rule" varchar(100) NOT NULL,
	"execution_mode" "schedule_execution_mode" NOT NULL,
	"last_executed_at" date
);
--> statement-breakpoint
CREATE INDEX "wallets_user_id_idx" ON "wallets" ("user_id");--> statement-breakpoint
CREATE INDEX "wallets_deleted_at_idx" ON "wallets" ("deleted_at");--> statement-breakpoint
CREATE INDEX "categories_user_id_idx" ON "categories" ("user_id");--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_deleted_at_idx" ON "categories" ("deleted_at");--> statement-breakpoint
CREATE INDEX "expenses_user_id_idx" ON "expenses" ("user_id");--> statement-breakpoint
CREATE INDEX "expenses_wallet_id_idx" ON "expenses" ("wallet_id");--> statement-breakpoint
CREATE INDEX "expenses_category_id_idx" ON "expenses" ("category_id");--> statement-breakpoint
CREATE INDEX "expenses_occurred_at_idx" ON "expenses" ("occurred_at");--> statement-breakpoint
CREATE INDEX "expenses_deleted_at_idx" ON "expenses" ("deleted_at");--> statement-breakpoint
CREATE INDEX "incomes_user_id_idx" ON "incomes" ("user_id");--> statement-breakpoint
CREATE INDEX "incomes_wallet_id_idx" ON "incomes" ("wallet_id");--> statement-breakpoint
CREATE INDEX "incomes_category_id_idx" ON "incomes" ("category_id");--> statement-breakpoint
CREATE INDEX "incomes_occurred_at_idx" ON "incomes" ("occurred_at");--> statement-breakpoint
CREATE INDEX "incomes_deleted_at_idx" ON "incomes" ("deleted_at");--> statement-breakpoint
CREATE INDEX "transfers_user_id_idx" ON "transfers" ("user_id");--> statement-breakpoint
CREATE INDEX "transfers_from_wallet_id_idx" ON "transfers" ("from_wallet_id");--> statement-breakpoint
CREATE INDEX "transfers_to_wallet_id_idx" ON "transfers" ("to_wallet_id");--> statement-breakpoint
CREATE INDEX "transfers_occurred_at_idx" ON "transfers" ("occurred_at");--> statement-breakpoint
CREATE INDEX "transfers_deleted_at_idx" ON "transfers" ("deleted_at");--> statement-breakpoint
CREATE INDEX "schedules_user_id_idx" ON "schedules" ("user_id");--> statement-breakpoint
CREATE INDEX "schedules_wallet_id_idx" ON "schedules" ("wallet_id");--> statement-breakpoint
CREATE INDEX "schedules_category_id_idx" ON "schedules" ("category_id");--> statement-breakpoint
CREATE INDEX "schedules_deleted_at_idx" ON "schedules" ("deleted_at");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_wallet_id_wallets_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_wallet_id_wallets_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_wallet_id_wallets_id_fkey" FOREIGN KEY ("from_wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_wallet_id_wallets_id_fkey" FOREIGN KEY ("to_wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_wallet_id_wallets_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;