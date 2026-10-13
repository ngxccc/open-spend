import { integer, text } from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid";

export const primaryKeyUuid = {
  id: text().primaryKey().$defaultFn(uuidv7),
};

export const activeStatus = {
  isActive: integer({ mode: "boolean" }).default(true).notNull(),
};

export const baseTimestamps = {
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() /* @__PURE__ */ => new Date()),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() /* @__PURE__ */ => new Date())
    .$onUpdate(() /* @__PURE__ */ => new Date()),
};

export const softDeleteTimestamp = {
  deletedAt: integer({ mode: "timestamp_ms" }),
};

export const fullEntity = {
  ...primaryKeyUuid,
  ...baseTimestamps,
  ...softDeleteTimestamp,
};

export const baseEntity = {
  ...primaryKeyUuid,
  ...baseTimestamps,
};
