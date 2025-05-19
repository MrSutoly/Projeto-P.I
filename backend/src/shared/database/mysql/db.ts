import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ProjectPI',
    port: 3306,
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