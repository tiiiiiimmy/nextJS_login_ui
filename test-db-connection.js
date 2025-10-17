const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'goldenset_db',
  user: process.env.DB_USER || 'postgres',
};

if (process.env.DB_PASSWORD) {
  poolConfig.password = process.env.DB_PASSWORD;
}

const pool = new Pool(poolConfig);

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('User:', process.env.DB_USER);

    const result = await pool.query('SELECT current_database(), current_user, version()');

    console.log('\n✅ Database connection successful!');
    console.log('Current database:', result.rows[0].current_database);
    console.log('Current user:', result.rows[0].current_user);
    console.log('PostgreSQL version:', result.rows[0].version.split('\n')[0]);

    const tableCheck = await pool.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );

    if (tableCheck.rows[0].exists) {
      console.log('\n✅ Users table exists');

      const columns = await pool.query(
        `SELECT column_name, data_type, is_nullable
         FROM information_schema.columns
         WHERE table_name = 'users'
         ORDER BY ordinal_position`
      );

      console.log('\nUsers table structure:');
      columns.rows.forEach(col => {
        const nullable = col.is_nullable === 'NO' ? 'NOT NULL' : '';
        console.log(`  - ${col.column_name}: ${col.data_type} ${nullable}`);
      });
    } else {
      console.log('\n❌ Users table does not exist');
    }

  } catch (error) {
    console.error('\n❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n✅ Test complete');
  }
}

testConnection();
