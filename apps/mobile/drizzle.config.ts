import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schemas/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
  verbose: true,
});
