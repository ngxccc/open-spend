import { type AnyPgColumn, index, snakeCase, uuid, varchar } from "drizzle-orm/pg-core";
import { categoryTypeEnum } from "./enums.schema";
import { fullEntity } from "./helpers.schema";

export const categories = snakeCase.table(
  "categories",
  {
    ...fullEntity,
    userId: uuid(),
    name: varchar({ length: 100 }).notNull(),
    type: categoryTypeEnum().notNull(),
    parentId: uuid().references((): AnyPgColumn => categories.id, {
      onDelete: "set null",
    }),
    icon: varchar({ length: 64 }),
    color: varchar({ length: 32 }),
  },
  (table) => [
    index("categories_user_id_idx").on(table.userId),
    index("categories_parent_id_idx").on(table.parentId),
    index("categories_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
