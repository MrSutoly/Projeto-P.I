import mysql from 'mysql2/promise';
import { config } from '../../config/env';

let pool: mysql.Pool;

export function initializeDatabase() {
    try {
        pool = mysql.createPool({
            host: config.database.host,
            port: config.database.port,
            user: config.database.user,
            password: config.database.password,
            database: config.database.name,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log('Pool de conexões MySQL inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar pool de conexões MySQL:', error);
        throw error;
    }
}

// Executar queries no banco de dados
export async function executeQuery<T = any>(query: string, params?: any[]): Promise<T> {
    if (!pool) {
        throw new Error('Pool de conexões não inicializado. Chame initializeDatabase() primeiro.');
    }

    try {
        const [rows] = await pool.execute(query, params);
        return rows as T;
    } catch (error) {
        console.error('Erro ao executar query:', error);
        console.error('Query:', query);
        console.error('Params:', params);
        throw error;
    }
}

// Fechar pool de conexões
export async function closeDatabase() {
    if (pool) {
        try {
            await pool.end();
            console.log('Pool de conexões MySQL fechado com sucesso');
        } catch (error) {
            console.error('Erro ao fechar pool de conexões MySQL:', error);
            throw error;
        }
    }
}

// Testar conexão 
export async function testConnection(): Promise<boolean> {
    try {
        await executeQuery('SELECT 1 as test');
        console.log('Conexão com MySQL testada com sucesso');
        return true;
    } catch (error) {
        console.error('Falha no teste de conexão com MySQL:', error);
        return false;
    }
} 