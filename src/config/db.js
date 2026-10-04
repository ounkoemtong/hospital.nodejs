// src/config/db.js
import mysql from 'mysql2/promise';
import 'dotenv/config';

// បង្កើត Pool សម្រាប់ភ្ជាប់ MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function សម្រាប់ Test ការតភ្ជាប់ពេល Server ចាប់ផ្ដើម
export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully!');
    connection.release(); // ដោះលែង connection ត្រឡប់ទៅ pool វិញ
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error.message);
    process.exit(1);
  }
};

export default pool;