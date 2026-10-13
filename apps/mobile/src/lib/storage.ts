import { Platform } from "react-native";

/**
 * Normalized synchronous Key-Value storage client.
 */
export interface StorageClient {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string | boolean | number) => void;
  getBoolean: (key: string) => boolean | undefined;
  getNumber: (key: string) => number | undefined;
  remove: (key: string) => void;
  clearAll: () => void;
}

class WebLocalStorage implements StorageClient {
  getString(key: string): string | undefined {
    if (typeof window === "undefined" || !window.localStorage) return undefined;
    const val = window.localStorage.getItem(key);
    return val !== null ? val : undefined;
  }

  set(key: string, value: string | boolean | number): void {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, String(value));
    }
  }

  getBoolean(key: string): boolean | undefined {
    if (typeof window === "undefined" || !window.localStorage) return undefined;
    const val = window.localStorage.getItem(key);
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }

  getNumber(key: string): number | undefined {
    if (typeof window === "undefined" || !window.localStorage) return undefined;
    const val = window.localStorage.getItem(key);
    if (val === null) return undefined;
    const num = Number(val);
    return Number.isNaN(num) ? undefined : num;
  }

  remove(key: string): void {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  }

  clearAll(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }
  }
}

class MemoryStorage implements StorageClient {
  private store: Record<string, string | boolean | number> = {};

  getString(key: string): string | undefined {
    const val = this.store[key];
    return typeof val === "string" ? val : undefined;
  }

  set(key: string, value: string | boolean | number): void {
    this.store[key] = value;
  }

  getBoolean(key: string): boolean | undefined {
    const val = this.store[key];
    return typeof val === "boolean" ? val : undefined;
  }

  getNumber(key: string): number | undefined {
    const val = this.store[key];
    return typeof val === "number" ? val : undefined;
  }

  remove(key: string): void {
    delete this.store[key];
  }

  clearAll(): void {
    this.store = {};
  }
}

let underlyingClient: StorageClient | null = null;

function getClient(): StorageClient {
  if (underlyingClient) return underlyingClient;

  if (Platform.OS === "web") {
    underlyingClient = new WebLocalStorage();
    return underlyingClient;
  }

  try {
    // Dynamically require createMMKV so module loading never throws fatal exception at bundle evaluation time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createMMKV } = require("react-native-mmkv");
    const mmkv = createMMKV({ id: "open-spend-cache" });
    underlyingClient = {
      getString: (key: string) => mmkv.getString(key),
      set: (key: string, val: string | boolean | number) => mmkv.set(key, val),
      getBoolean: (key: string) => mmkv.getBoolean(key),
      getNumber: (key: string) => mmkv.getNumber(key),
      remove: (key: string) => {
        mmkv.remove(key);
      },
      clearAll: () => {
        mmkv.clearAll();
      },
    };
    return underlyingClient;
  } catch {
    underlyingClient = new MemoryStorage();
    return underlyingClient;
  }
}

export const kvStorage: StorageClient = {
  getString: (key: string) => getClient().getString(key),
  set: (key: string, val: string | boolean | number) => getClient().set(key, val),
  getBoolean: (key: string) => getClient().getBoolean(key),
  getNumber: (key: string) => getClient().getNumber(key),
  remove: (key: string) => getClient().remove(key),
  clearAll: () => getClient().clearAll(),
};

export const StorageKeys = {
  PRIVACY_MASK: "privacy_mask_enabled",
  ACTIVE_WALLET_ID: "active_wallet_id",
  CACHED_NET_WORTH: "cached_net_worth",
  GUEST_SESSION: "guest_session_active",
} as const;
