CREATE TABLE `wallets` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`initial_balance` text NOT NULL,
	`currency` text DEFAULT 'VND' NOT NULL,
	`icon` text,
	`color` text
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`parent_id` text,
	`icon` text,
	`color` text,
	CONSTRAINT `fk_categories_parent_id_categories_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	`wallet_id` text NOT NULL,
	`category_id` text NOT NULL,
	`amount` text NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`occurred_at` text NOT NULL,
	`minute_of_day` integer,
	CONSTRAINT `fk_expenses_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_expenses_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `incomes` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	`wallet_id` text NOT NULL,
	`category_id` text NOT NULL,
	`amount` text NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`occurred_at` text NOT NULL,
	`minute_of_day` integer,
	CONSTRAINT `fk_incomes_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_incomes_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`user_id` text,
	`from_wallet_id` text NOT NULL,
	`to_wallet_id` text NOT NULL,
	`amount` text NOT NULL,
	`fee` text DEFAULT '0.0000' NOT NULL,
	`note` text,
	`occurred_at` text NOT NULL,
	CONSTRAINT `fk_transfers_from_wallet_id_wallets_id_fk` FOREIGN KEY (`from_wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_transfers_to_wallet_id_wallets_id_fk` FOREIGN KEY (`to_wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`user_id` text,
	`wallet_id` text NOT NULL,
	`category_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` text NOT NULL,
	`title` text NOT NULL,
	`cron_rule` text NOT NULL,
	`execution_mode` text NOT NULL,
	`last_executed_at` text,
	CONSTRAINT `fk_schedules_wallet_id_wallets_id_fk` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_schedules_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `sync_queue` (
	`id` text PRIMARY KEY,
	`entity` text NOT NULL,
	`entity_id` text NOT NULL,
	`mutation_type` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` integer NOT NULL,
	`processed_at` integer
);
--> statement-breakpoint
CREATE INDEX `wallets_user_id_idx` ON `wallets` (`user_id`);--> statement-breakpoint
CREATE INDEX `wallets_deleted_at_idx` ON `wallets` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `categories_user_id_idx` ON `categories` (`user_id`);--> statement-breakpoint
CREATE INDEX `categories_parent_id_idx` ON `categories` (`parent_id`);--> statement-breakpoint
CREATE INDEX `categories_deleted_at_idx` ON `categories` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `expenses_user_id_idx` ON `expenses` (`user_id`);--> statement-breakpoint
CREATE INDEX `expenses_wallet_id_idx` ON `expenses` (`wallet_id`);--> statement-breakpoint
CREATE INDEX `expenses_category_id_idx` ON `expenses` (`category_id`);--> statement-breakpoint
CREATE INDEX `expenses_occurred_at_idx` ON `expenses` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `expenses_deleted_at_idx` ON `expenses` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `incomes_user_id_idx` ON `incomes` (`user_id`);--> statement-breakpoint
CREATE INDEX `incomes_wallet_id_idx` ON `incomes` (`wallet_id`);--> statement-breakpoint
CREATE INDEX `incomes_category_id_idx` ON `incomes` (`category_id`);--> statement-breakpoint
CREATE INDEX `incomes_occurred_at_idx` ON `incomes` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `incomes_deleted_at_idx` ON `incomes` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `transfers_user_id_idx` ON `transfers` (`user_id`);--> statement-breakpoint
CREATE INDEX `transfers_from_wallet_id_idx` ON `transfers` (`from_wallet_id`);--> statement-breakpoint
CREATE INDEX `transfers_to_wallet_id_idx` ON `transfers` (`to_wallet_id`);--> statement-breakpoint
CREATE INDEX `transfers_occurred_at_idx` ON `transfers` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `transfers_deleted_at_idx` ON `transfers` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `schedules_user_id_idx` ON `schedules` (`user_id`);--> statement-breakpoint
CREATE INDEX `schedules_wallet_id_idx` ON `schedules` (`wallet_id`);--> statement-breakpoint
CREATE INDEX `schedules_category_id_idx` ON `schedules` (`category_id`);--> statement-breakpoint
CREATE INDEX `schedules_deleted_at_idx` ON `schedules` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `sync_queue_status_created_at_idx` ON `sync_queue` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `sync_queue_entity_idx` ON `sync_queue` (`entity`,`entity_id`);