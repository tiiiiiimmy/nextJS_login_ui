// Script to initialize database schema
import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath, override: true });

const DB_HOST = process.env.DB_HOST || "170.64.220.56";
const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
const DB_USER = process.env.DB_USER || "dashboard_user";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "goldenset_db";

async function initializeSchema() {
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: false,
  });

  try {
    console.log(`Connecting to database '${DB_NAME}' at ${DB_HOST}:${DB_PORT}...`);
    await client.connect();
    console.log("Connected successfully!");

    // Read the schema file
    const schemaPath = path.resolve(process.cwd(), "database", "schema.sql");
    console.log(`\nReading schema from: ${schemaPath}`);

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, "utf-8");

    console.log("\nExecuting schema...");
    await client.query(schema);

    console.log("✓ Schema created successfully!");

    // Verify the users table was created
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log("\nTables in database:");
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Show users table structure
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log("\nUsers table structure:");
    columnsResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
    });

  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\nConnection closed.");
  }
}

// Run the script
initializeSchema()
  .then(() => {
    console.log("\n✓ Database schema initialization completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Schema initialization failed:", error.message);
    process.exit(1);
  });
