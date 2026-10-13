import { AppState, type AppStateStatus, Platform } from "react-native";
import { Directory, File, Paths, FileMode } from "expo-file-system";
import { sanitizeData } from "./sanitizer";

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  app: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: unknown;
}

class ProductionLogger {
  private buffer: string[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private isFlushing = false;
  private readonly APP_NAME = "open-spend";
  private readonly MAX_BATCH_SIZE = 20;
  private readonly FLUSH_INTERVAL_MS = 4000;
  private readonly MAX_LOG_AGE_DAYS = 5;
  private logDirectory: Directory | null = null;

  constructor() {
    void this.init();
  }

  private async init() {
    if (Platform.OS === "web") return;

    try {
      this.logDirectory = new Directory(Paths.document, `${this.APP_NAME}-logs`);
      if (!this.logDirectory.exists) {
        this.logDirectory.create();
      }

      this.flushTimer = setInterval(() => {
        void this.flush();
      }, this.FLUSH_INTERVAL_MS);

      AppState.addEventListener("change", (nextState: AppStateStatus) => {
        if (nextState === "background" || nextState === "inactive") {
          void this.flush();
        }
      });

      this.pruneOldLogs();
    } catch (err) {
      if (__DEV__) {
        console.warn("[Logger Init Error]:", err);
      }
    }
  }

  private getTodayFilename(): string {
    const today = new Date().toISOString().slice(0, 10);
    return `${this.APP_NAME}-${today}.log`;
  }

  public log(level: LogLevel, message: string, metadata?: unknown): void {
    // 1. Sanitize to prevent leaks in logs and crash dumps
    const sanitizedMeta = metadata !== undefined ? sanitizeData(metadata) : undefined;
    const sanitizedMsg = typeof message === "string" ? (sanitizeData(message) as string) : message;

    const entry: LogEntry = {
      app: this.APP_NAME,
      timestamp: new Date().toISOString(),
      level,
      message: sanitizedMsg,
      metadata: sanitizedMeta,
    };

    if (__DEV__) {
      const consoleFn =
        level === "ERROR"
          ? console.error
          : level === "WARN"
            ? console.warn
            : level === "DEBUG"
              ? console.debug
              : console.log;
      consoleFn(`[${this.APP_NAME} ${level}]`, sanitizedMsg, sanitizedMeta ?? "");
    }

    // 2. Queue for asynchronous file writing on native
    if (Platform.OS !== "web") {
      this.buffer.push(JSON.stringify(entry) + "\n");
      if (level === "ERROR" || this.buffer.length >= this.MAX_BATCH_SIZE) {
        void this.flush();
      }
    }
  }

  public info(message: string, meta?: unknown) {
    this.log("INFO", message, meta);
  }

  public warn(message: string, meta?: unknown) {
    this.log("WARN", message, meta);
  }

  public error(message: string, meta?: unknown) {
    this.log("ERROR", message, meta);
  }

  public debug(message: string, meta?: unknown) {
    if (__DEV__) {
      this.log("DEBUG", message, meta);
    }
  }

  public async flush(): Promise<void> {
    if (this.buffer.length === 0 || this.isFlushing || !this.logDirectory) return;

    this.isFlushing = true;
    const chunk = this.buffer.splice(0, this.buffer.length).join("");

    try {
      const file = new File(this.logDirectory, this.getTodayFilename());
      if (!file.exists) {
        file.create();
      }

      // Modern Expo SDK 57 O(1) byte append without loading the full file into JS memory
      const handle = file.open(FileMode.Append);
      try {
        const encoded = new TextEncoder().encode(chunk);
        handle.writeBytes(encoded);
      } finally {
        handle.close();
      }
    } catch (err) {
      if (__DEV__) {
        console.warn("[Logger Flush Warning]:", err);
      }
      this.buffer.unshift(chunk);
    } finally {
      this.isFlushing = false;
    }
  }

  private pruneOldLogs(): void {
    if (!this.logDirectory) return;

    try {
      const files = this.logDirectory.list();
      const cutoffTime = Date.now() - this.MAX_LOG_AGE_DAYS * 24 * 60 * 60 * 1000;

      for (const item of files) {
        if (item instanceof File && item.name.startsWith(`${this.APP_NAME}-`)) {
          const statsDate = item.creationTime ? new Date(item.creationTime).getTime() : 0;
          if (statsDate > 0 && statsDate < cutoffTime) {
            item.delete();
          }
        }
      }
    } catch {
      // Ignored non-fatal prune warning
    }
  }

  public async getLatestLogs(): Promise<string> {
    await this.flush();
    if (!this.logDirectory) return "";

    try {
      const file = new File(this.logDirectory, this.getTodayFilename());
      if (file.exists) {
        return file.text();
      }
    } catch {
      return "";
    }
    return "";
  }
}

export const logger = new ProductionLogger();
