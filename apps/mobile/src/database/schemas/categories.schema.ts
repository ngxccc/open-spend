import { type AnySQLiteColumn, index, snakeCase, text } from "drizzle-orm/sqlite-core";
import type { CategoryType } from "./enums.schema";
import { fullEntity } from "./helpers.schema";

export const categories = snakeCase.table(
  "categories",
  {
    ...fullEntity,
    userId: text(),
    name: text().notNull(),
    type: text().$type<CategoryType>().notNull(),
    parentId: text().references((): AnySQLiteColumn => categories.id, {
      onDelete: "set null",
    }),
    icon: text(),
    color: text(),
  },
  (table) => [
    index("categories_user_id_idx").on(table.userId),
    index("categories_parent_id_idx").on(table.parentId),
    index("categories_deleted_at_idx").on(table.deletedAt),
  ],
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
