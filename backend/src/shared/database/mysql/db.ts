import mysql from 'mysql2/promise';
import { AppError } from '../../errors/AppError';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '9297',
    database: process.env.DB_NAME || 'ProjectPI',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function executeQuery<T>(query: string, params?: any[]): Promise<T> {
    try {
        const [result] = await pool.execute(query, params);
        return result as T;
    } catch (error: any) {
        console.error('Database error:', error);
        throw new AppError(
            'Erro ao executar operação no banco de dados',
            500
        );
    }
}

export async function executeTransaction<T>(
    queries: { query: string; params?: any[] }[]
): Promise<T> {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const { query, params } of queries) {
            await connection.execute(query, params);
        }

        await connection.commit();
        return {} as T;
    } catch (error: any) {
        await connection.rollback();
        console.error('Transaction error:', error);
        throw new AppError(
            'Erro ao executar transação no banco de dados',
            500
        );
    } finally {
        connection.release();
    }
}

export default pool;