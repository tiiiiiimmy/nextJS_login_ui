// api/db/connection.ts
import { Pool, PoolConfig, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";
import path from "path";

// Explicitly load .env from project root (works with tsx runtime)
const envPath = path.resolve(process.cwd(), ".env");
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("[BOOT] Failed to load .env:", result.error.message);
} else {
  console.log(`[BOOT] Loaded .env from: ${envPath}`);
}
console.log("[BOOT] USE_DB=", process.env.USE_DB);
console.log("[BOOT] DATABASE_URL exists =", Boolean(process.env.DATABASE_URL));
console.log("[BOOT] DB_HOST=", process.env.DB_HOST);

/**
 * Whether the DB layer is enabled. In sandbox/demo environments you may set USE_DB=false
 * to disable real DB access and fall back to in-memory storage in your model layer.
 * Default: true (enabled)
 */
export const isDbEnabled =
  (process.env.USE_DB ?? "true").toLowerCase() !== "false";

/**
 * Auto-detect if SSL should be enabled for the connection.
 * - Many hosted Postgres providers (Supabase, Neon, Render, Railway, AWS RDS) require SSL.
 * - If DB_SSL=true, force SSL.
 * - If the connection string contains "sslmode=require", SSL is required.
 * - Otherwise, enable SSL for common hosted domains by default.
 */
function shouldUseSSL(cs?: string): boolean {
  if ((process.env.DB_SSL ?? "").toLowerCase() === "true") return true;
  if (!cs) return false;
  if (/sslmode=require/i.test(cs)) return true;
  if (
    /(\.supabase\.co|\.neon\.tech|\.railway\.app|\.render\.com|rds\.amazonaws\.com)/i.test(
      cs
    )
  ) {
    return true;
  }
  return false;
}

/**
 * Build the Pool configuration.
 * Priority of configuration:
 *   1) DATABASE_URL (single connection string)
 *   2) Discrete env vars: DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD
 * Notes:
 * - In CodeSandbox or serverless environments, prefer DATABASE_URL.
 * - Supabase requires SSL (rejectUnauthorized=false is common).
 */
function buildPoolConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (connectionString) {
    const useSSL = shouldUseSSL(connectionString);
    const cfg: PoolConfig = {
      connectionString,
      max: parseInt(process.env.DB_POOL_MAX || "20", 10),
      idleTimeoutMillis: parseInt(
        process.env.DB_IDLE_TIMEOUT_MS || "30000",
        10
      ),
      connectionTimeoutMillis: parseInt(
        process.env.DB_CONN_TIMEOUT_MS || "5000",
        10
      ),
    };
    if (useSSL) {
      // Most hosted providers require SSL but will use self-signed certs.
      cfg.ssl = { rejectUnauthorized: false };
    }
    return cfg;
  }

  // Fallback to discrete env variables (local dev)
  const host = process.env.DB_HOST || "localhost";
  const port = parseInt(process.env.DB_PORT || "5432", 10);
  const database = process.env.DB_NAME || "goldenset_db";
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || undefined;

  const cfg: PoolConfig = {
    host,
    port,
    database,
    user,
    password,
    max: parseInt(process.env.DB_POOL_MAX || "20", 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || "30000", 10),
    connectionTimeoutMillis: parseInt(
      process.env.DB_CONN_TIMEOUT_MS || "5000",
      10
    ),
  };

  // If host hints a hosted provider, enable SSL automatically.
  if (shouldUseSSL(host)) {
    cfg.ssl = { rejectUnauthorized: false };
  }

  return cfg;
}

// Create the pool only if DB is enabled. Otherwise keep it null and let callers decide.
let pool: Pool | null = null;

if (isDbEnabled) {
  const poolConfig = buildPoolConfig();
  pool = new Pool(poolConfig);

  // Log a friendly summary (without secrets)
  const source = process.env.DATABASE_URL
    ? "DATABASE_URL"
    : `${process.env.DB_HOST ?? "localhost"}:${process.env.DB_PORT ?? "5432"}`;
  console.log(
    `[DB] Pool created from ${source} (ssl=${Boolean(
      (poolConfig as any).ssl
    )}, max=${poolConfig.max}, idleTimeout=${poolConfig.idleTimeoutMillis}ms)`
  );

  // Do NOT hard-exit on idle error in ephemeral environments; just log it.
  pool.on("error", (err) => {
    console.error("[DB] Unexpected error on idle client:", err);
  });
} else {
  console.log(
    "[DB] Disabled (USE_DB=false). Models should fall back to in-memory storage."
  );
}

/**
 * Get the active pool. Throws an explicit error if DB is disabled to allow callers
 * to fallback to an in-memory implementation gracefully.
 */
export function getPool(): Pool {
  if (!isDbEnabled || !pool) {
    throw new Error("DB disabled (USE_DB=false) or pool not initialized.");
  }
  return pool;
}

/**
 * Execute a parametrized SQL query.
 * - Avoid logging full text for sensitive queries in production.
 * - Returns the raw QueryResult from 'pg'.
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  if (!isDbEnabled || !pool) {
    throw new Error("DB disabled (USE_DB=false) or pool not initialized.");
  }

  const start = Date.now();
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();
    const res = await client.query<T>(text, params);
    const duration = Date.now() - start;

    // Safe-ish logging: do not print parameters in production logs.
    if ((process.env.NODE_ENV ?? "development") !== "production") {
      console.log("[DB] query", {
        text,
        durationMs: duration,
        rows: res.rowCount,
      });
    } else {
      console.log("[DB] query", { durationMs: duration, rows: res.rowCount });
    }

    return res;
  } catch (error) {
    // Be explicit in logs to help debugging connectivity issues in sandbox.
    console.error("[DB] Query error:", {
      text,
      error: (error as Error)?.message ?? error,
    });
    throw error;
  } finally {
    if (client) client.release();
  }
}

/**
 * Get a dedicated client from the pool (useful for transactions).
 * - Includes a watchdog timer to warn if a client is held for too long.
 */
export async function getClient(): Promise<PoolClient> {
  if (!isDbEnabled || !pool) {
    throw new Error("DB disabled (USE_DB=false) or pool not initialized.");
  }

  const client = await pool.connect();
  const release = client.release.bind(client);

  // Warn if a client is held for too long (helps spotting leaked clients).
  const timeoutMs = parseInt(process.env.DB_CLIENT_HOLD_WARN_MS || "5000", 10);
  const timer = setTimeout(() => {
    console.error(
      `[DB] A client has been checked out for more than ${timeoutMs}ms!`
    );
  }, timeoutMs);

  // Monkey-patch release to clear the watchdog timer
  client.release = () => {
    clearTimeout(timer);
    client.release = release;
    return release();
  };

  return client;
}

/**
 * Gracefully close the pool (useful in tests or shutdown hooks).
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("[DB] Pool closed.");
  }
}

export default pool;
