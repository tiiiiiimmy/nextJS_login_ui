import dotenv from 'dotenv';
import { query, closePool } from './db/connection.js';

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('User:', process.env.DB_USER);

    // Test query
    const result = await query('SELECT current_database(), current_user, version()');

    console.log('\n✅ Database connection successful!');
    console.log('Current database:', result.rows[0].current_database);
    console.log('Current user:', result.rows[0].current_user);
    console.log('PostgreSQL version:', result.rows[0].version);

    // Check if users table exists
    const tableCheck = await query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );

    if (tableCheck.rows[0].exists) {
      console.log('\n✅ Users table exists');

      // Get table structure
      const columns = await query(
        `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = 'users'
         ORDER BY ordinal_position`
      );

      console.log('\nUsers table structure:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });
    } else {
      console.log('\n❌ Users table does not exist');
    }

  } catch (error) {
    console.error('\n❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await closePool();
    console.log('\n✅ Database connection closed');
  }
}

testConnection();
