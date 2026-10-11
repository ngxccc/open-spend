import { Hono } from "hono";
import { logger } from "hono/logger";
import packageJson from "../package.json";
import { env } from "./env";
const app = new Hono();

app.use("*", logger());

app.get("/", (c) => {
  return c.json({
    service: "open-spend-server",
    status: "healthy",
    version: packageJson.version,
  });
});

app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    version: packageJson.version,
    ...(env.NODE_ENV === "development" && { environment: env.NODE_ENV }),
    timestamp: new Date().toISOString(),
  });
});

export default app;
