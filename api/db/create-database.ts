// Script to create a new database on PostgreSQL server
import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
const envPath = path.resolve(process.cwd(), ".env");
console.log(`Loading .env from: ${envPath}`);
console.log(`File exists: ${fs.existsSync(envPath)}`);

const result = dotenv.config({ path: envPath, override: true });
if (result.error) {
  console.error("Error loading .env:", result.error);
} else {
  console.log("Environment variables loaded successfully");
}

const DB_HOST = process.env.DB_HOST || "170.64.220.56";
const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "goldenset_db";

async function createDatabase() {
  console.log("Configuration:");
  console.log(`  DB_HOST: ${DB_HOST}`);
  console.log(`  DB_PORT: ${DB_PORT}`);
  console.log(`  DB_USER: ${DB_USER}`);
  console.log(`  DB_NAME: ${DB_NAME}`);

  // First, connect to the default 'postgres' database
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "postgres", // Connect to default postgres database
    ssl: false,
  });

  try {
    console.log(`Connecting to PostgreSQL at ${DB_HOST}:${DB_PORT}...`);
    await client.connect();
    console.log("Connected successfully!");

    // Check if database already exists
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (checkResult.rowCount && checkResult.rowCount > 0) {
      console.log(`Database '${DB_NAME}' already exists.`);
    } else {
      // Create the database
      console.log(`Creating database '${DB_NAME}'...`);
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database '${DB_NAME}' created successfully!`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

// Run the script
createDatabase()
  .then(() => {
    console.log("\nDatabase setup completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nDatabase setup failed:", error.message);
    process.exit(1);
  });
