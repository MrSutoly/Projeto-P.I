import { createClient } from '@supabase/supabase-js';
import { config } from './env';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.anonKey;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e Anon Key são obrigatórios');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para testar conexão
export async function testSupabaseConnection(): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('Erro ao testar conexão com Supabase');
            return false;
        }
        
        console.log('Conexão com Supabase testada com sucesso');
        return true;
    } catch (error) {
        console.error('Falha no teste de conexão com Supabase');
        return false;
    }
} 