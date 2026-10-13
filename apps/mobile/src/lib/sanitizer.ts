/**
 * Sensitive key patterns to redact automatically.
 */
const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /auth/i,
  /api[-_]?key/i,
  /bearer/i,
  /credit[-_]?card/i,
  /cvv/i,
  /private/i,
];

const JWT_REGEX = /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]+/g;
const BEARER_REGEX = /Bearer\s+([a-zA-Z0-9_\-.]+)/gi;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

/**
 * Sanitizes plain string payloads by redacting sensitive tokens and masking PII.
 */
export function sanitizeString(value: string): string {
  return value
    .replace(BEARER_REGEX, "Bearer [REDACTED]")
    .replace(JWT_REGEX, "[JWT_REDACTED]")
    .replace(EMAIL_REGEX, (match) => {
      const parts = match.split("@");
      const user = parts[0] ?? "";
      const domain = parts[1] ?? "";
      return `${user.slice(0, 2)}***@${domain}`;
    });
}

/**
 * Recursively redacts sensitive keys and values from objects, arrays, and primitives.
 */
export function sanitizeData(data: unknown, seen = new WeakSet()): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    return sanitizeString(data);
  }

  if (typeof data !== "object") {
    return data;
  }

  if (seen.has(data as object)) {
    return "[Circular Reference]";
  }
  seen.add(data as object);

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item, seen));
  }

  const sanitizedObj: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    const isKeySensitive = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
    if (isKeySensitive) {
      sanitizedObj[key] = "[REDACTED]";
    } else {
      sanitizedObj[key] = sanitizeData(val, seen);
    }
  }

  return sanitizedObj;
}
