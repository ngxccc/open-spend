import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const ENVIRONMENT_MODES = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type EnvironmentMode = (typeof ENVIRONMENT_MODES)[keyof typeof ENVIRONMENT_MODES];

const robustUrlSchema = z.preprocess((val) => {
  if (typeof val !== "string" || val === "") return undefined;
  if (!val.includes("://") && val.trim().length > 0) {
    return `https://${val}`;
  }
  return val;
}, z.string().url());

export const env = createEnv({
  server: {
    PORT: z
      .string()
      .or(z.number())
      .transform((val) => (typeof val === "number" ? val : Number(val)))
      .default(3000),

    NODE_ENV: z
      .preprocess(
        (val) => (typeof val === "string" ? val.toLowerCase() : val),
        z.enum([
          ENVIRONMENT_MODES.DEVELOPMENT,
          ENVIRONMENT_MODES.PRODUCTION,
          ENVIRONMENT_MODES.TEST,
        ]),
      )
      .default(ENVIRONMENT_MODES.DEVELOPMENT),

    // Database connection string (PostgreSQL / Neon)
    DB_URL: robustUrlSchema
      .optional()
      .catch(undefined)
      .default(
        "postgresql://neondb_owner:npg_sample@ep-sample-pooler.ap-southeast-1.aws.neon.tech/openspend?sslmode=require",
      ),

    // JWT Configuration
    JWT_SECRET: z
      .string()
      .min(16, "JWT_SECRET should be at least 16 characters")
      .default("skibiditoilet-tungtungshahu"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

    // Cloudflare Deployment secrets
    CLOUDFLARE_ACCOUNT_ID: z.string().optional().catch(undefined),
    CLOUDFLARE_API_TOKEN: z.string().optional().catch(undefined),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || process.env.NODE_ENV === "test",

  onValidationError: (issues) => {
    console.error("❌ Invalid environment variables configuration:");
    for (const issue of issues) {
      let pathString = "root";
      if (issue.path && Array.isArray(issue.path)) {
        pathString = issue.path.map((segment) => String(segment)).join(".");
      }
      console.error(` - ${pathString}: ${issue.message}`);
    }
    if (typeof process !== "undefined" && typeof process.exit === "function") {
      process.exit(1);
    }
    throw new Error("Invalid environment variables configuration");
  },
});
