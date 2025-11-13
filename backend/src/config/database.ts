// =====================================================
// Database Configuration
// MySQL connection setup with connection pooling
// =====================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'theatre_management_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create connection pool (as per SRS performance requirements)
export const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    console.log(`✓ Connected to: ${dbConfig.database}`);
    connection.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
};

// Execute query with connection from pool
export const query = async <T = any>(sql: string, params?: any[]): Promise<T> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute query and return first row
export const queryOne = async (sql: string, params?: any[]): Promise<any> => {
  const rows = await query(sql, params);
  return rows[0] || null;
};

// Transaction support
export const transaction = async (callback: (connection: mysql.PoolConnection) => Promise<void>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await callback(connection);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default pool;
