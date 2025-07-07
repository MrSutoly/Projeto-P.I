import { supabase } from '../../config/supabase';

// Função para executar queries no Supabase
export async function executeQuery<T = any>(query: string, params?: any[]): Promise<T> {
    try {
        // Para o Supabase, vamos usar a API REST em vez de SQL direto
        // Esta função será adaptada conforme necessário para cada tipo de operação
        
        // Por enquanto, retornamos um array vazio
        // As implementações específicas serão feitas nos repositórios
        return [] as T;
    } catch (error) {
        console.error('Erro ao executar query no Supabase');
        throw error;
    }
}

// Função para buscar dados de uma tabela
export async function selectFromTable<T = any>(
    table: string, 
    columns: string = '*', 
    filters?: Record<string, any>
): Promise<T[]> {
    try {
        let query = supabase.from(table).select(columns);
        
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }
        
        const { data, error } = await query;
        
        if (error) {
            throw error;
        }
        
        return (data as T[]) || [];
    } catch (error) {
        console.error(`Erro ao buscar dados da tabela ${table}`);
        throw error;
    }
}

// Função para inserir dados em uma tabela
export async function insertIntoTable<T = any>(
    table: string, 
    data: Record<string, any>
): Promise<T> {
    try {
        const { data: result, error } = await supabase
            .from(table)
            .insert(data)
            .select()
            .single();
        
        if (error) {
            throw error;
        }
        
        return result;
    } catch (error) {
        console.error(`Erro ao inserir dados na tabela ${table}`);
        throw error;
    }
}

// Função para atualizar dados em uma tabela
export async function updateTable<T = any>(
    table: string, 
    data: Record<string, any>, 
    filters: Record<string, any>
): Promise<T[]> {
    try {
        let query = supabase.from(table).update(data);
        
        Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
        
        const { data: result, error } = await query.select();
        
        if (error) {
            throw error;
        }
        
        return result || [];
    } catch (error) {
        console.error(`Erro ao atualizar dados na tabela ${table}`);
        throw error;
    }
}

// Função para deletar dados de uma tabela
export async function deleteFromTable<T = any>(
    table: string, 
    filters: Record<string, any>
): Promise<T[]> {
    try {
        let query = supabase.from(table).delete();
        
        Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
        
        const { data: result, error } = await query.select();
        
        if (error) {
            throw error;
        }
        
        return result || [];
    } catch (error) {
        console.error(`Erro ao deletar dados da tabela ${table}`);
        throw error;
    }
}

// Função para buscar um registro específico
export async function findOne<T = any>(
    table: string, 
    filters: Record<string, any>
): Promise<T | null> {
    try {
        let query = supabase.from(table).select('*');
        
        Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
        
        const { data, error } = await query.single();
        
        if (error) {
            if (error.code === 'PGRST116') { // Nenhum resultado encontrado
                return null;
            }
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error(`Erro ao buscar registro na tabela ${table}`);
        throw error;
    }
}

// Testar conexão 
export async function testConnection(): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('Falha no teste de conexão com Supabase');
            return false;
        }
        
        console.log('Conexão com Supabase testada com sucesso');
        return true;
    } catch (error) {
        console.error('Falha no teste de conexão com Supabase');
        return false;
    }
} 