import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  export const executeQuery = async <T>(query: string, params?: any[]): Promise<T> => {
    try {
      const [rows] = await pool.execute(query, params);
      return rows as T;
    } catch (error) {
      console.error('Erro no banco:', error);
      throw error;
    }
  };
  
  export default pool;