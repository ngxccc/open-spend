import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { readFile, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { sql } from "drizzle-orm";
import { createDatabaseClient } from "../src/database";

async function forceBaseline() {
  const db = createDatabaseClient();
  const injectOnly = process.argv.includes("--inject-only");

  console.log(
    injectOnly
      ? "Initializing Automated Baselining Protocol (Injection Only)..."
      : "Initializing Automated Baselining Protocol...",
  );

  const drizzleDir = join(process.cwd(), "drizzle");

  if (!injectOnly) {
    // 1. Delete all existing migration folders
    try {
      const entries = await readdir(drizzleDir, { withFileTypes: true });
      const migrationFolders = entries
        .filter((dirent) => dirent.isDirectory() && /^\d{14}/.test(dirent.name))
        .map((dirent) => dirent.name);

      await Promise.all(
        migrationFolders.map((folder) => {
          console.log(`Cleaning up old migration folder: ${folder}`);
          return rm(join(drizzleDir, folder), { recursive: true, force: true });
        }),
      );
    } catch {
      console.log("No existing drizzle directory or folders to clean up.");
    }

    // 2. Automatically generate the new consolidated migration
    console.log("Generating consolidated drizzle migration...");
    try {
      execSync("bun run db:generate", {
        stdio: "inherit",
      });
    } catch (error) {
      console.error("Failed to generate migration via drizzle-kit:", error);
      process.exit(1);
    }
  }

  // 3. Read the newly generated migration folder
  const entriesAfterGen = await readdir(drizzleDir, { withFileTypes: true });
  const migrationFoldersAfterGen = entriesAfterGen
    .filter((dirent) => dirent.isDirectory() && /^\d{14}/.test(dirent.name))
    .map((dirent) => dirent.name)
    .toSorted((a, b) => a.localeCompare(b));

  const latestMigrationName = migrationFoldersAfterGen.at(-1);

  if (!latestMigrationName) {
    console.error("No migration folders found after generation!");
    process.exit(1);
  }

  const sqlFilePath = join(drizzleDir, latestMigrationName, "migration.sql");
  const fullSqlContent = await readFile(sqlFilePath, "utf8");
  const hash = createHash("sha256").update(fullSqlContent).digest("hex");
  const createdAt = Date.now();

  console.log(`Injecting Consolidated Migration Record: ${latestMigrationName}`);
  try {
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "drizzle";`);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint,
        name text,
        applied_at timestamp with time zone DEFAULT now()
      );
    `);
    await db.transaction(async (tx) => {
      await tx.execute(sql`
        TRUNCATE TABLE "drizzle"."__drizzle_migrations" RESTART IDENTITY;
      `);
      await tx.execute(sql`
        INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at, name, applied_at)
        VALUES (${hash}, ${createdAt}, ${latestMigrationName}, NOW());
      `);
    });
    console.log("Baselining Complete! Migration record injected & synced in __drizzle_migrations.");
    process.exit(0);
  } catch (error) {
    console.error("Fatal Error during injection:", error);
    process.exit(1);
  }
}

await forceBaseline();
