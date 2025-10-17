const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

async function testRegistration() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('Testing bcrypt...');
    const testPassword = 'qW123..22';
    const hash = await bcrypt.hash(testPassword, 10);
    console.log('✅ Bcrypt hash successful:', hash.substring(0, 20) + '...');

    console.log('\nTesting database insert...');
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email, created_at`,
      ['Timmy', 'Huang', '1233@gmail.com', hash]
    );

    console.log('✅ User created successfully:');
    console.log(result.rows[0]);

    // Clean up - delete the test user
    await pool.query('DELETE FROM users WHERE email = $1', ['1233@gmail.com']);
    console.log('\n✅ Test user deleted');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testRegistration();
