import { injectable } from 'tsyringe';
import { selectFromTable, insertIntoTable, updateTable, deleteFromTable, findOne } from '../../../shared/database/supabase/db';
import { IAtividadeRepository } from './i_atividade_repository';
import { Atividade, Pergunta, Opcao } from '../../../shared/util/entities/atividade_type';

@injectable()
export class AtividadeRepository implements IAtividadeRepository {
    // Atividades
    async findAllAtividades(): Promise<Atividade[]> {
        return await selectFromTable<Atividade>('atividades');
    }

    async findAtividadeById(id: number): Promise<Atividade | null> {
        return await findOne<Atividade>('atividades', { id });
    }

    async findAtividadesByStatus(status: string): Promise<Atividade[]> {
        return await selectFromTable<Atividade>('atividades', '*', { status });
    }

    async createAtividade(atividade: Atividade): Promise<Atividade> {
        const atividadeData = {
            titulo: atividade.titulo,
            descricao: atividade.descricao,
            tipo: atividade.tipo,
            ordem: atividade.ordem,
            data: atividade.data,
            horario: atividade.horario,
            status: atividade.status || 'bloqueada',
            pontos: atividade.pontos || 0
        };

        const result = await insertIntoTable('atividades', atividadeData);
        return result[0] as Atividade;
    }

    async updateAtividade(atividade: Atividade): Promise<Atividade> {
        const { id, ...atividadeData } = atividade;
        
        const result = await updateTable('atividades', atividadeData, { id });
        return result[0] as Atividade;
    }

    async deleteAtividade(id: number): Promise<void> {
        await deleteFromTable('atividades', { id });
    }

    // Perguntas
    async findPerguntasByAtividade(atividadeId: number): Promise<Pergunta[]> {
        return await selectFromTable<Pergunta>('perguntas', '*', { atividade_id: atividadeId });
    }

    async createPergunta(pergunta: Pergunta): Promise<Pergunta> {
        const perguntaData = {
            atividade_id: pergunta.atividade_id,
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            ordem: pergunta.ordem
        };

        const result = await insertIntoTable('perguntas', perguntaData);
        return result[0] as Pergunta;
    }

    async updatePergunta(pergunta: Pergunta): Promise<Pergunta> {
        const { id, ...perguntaData } = pergunta;
        
        const result = await updateTable('perguntas', perguntaData, { id });
        return result[0] as Pergunta;
    }

    async deletePergunta(id: number): Promise<void> {
        await deleteFromTable('perguntas', { id });
    }

    // Opções
    async findOpcoesByPergunta(perguntaId: number): Promise<Opcao[]> {
        return await selectFromTable<Opcao>('opcoes', '*', { pergunta_id: perguntaId });
    }

    async createOpcao(opcao: Opcao): Promise<Opcao> {
        const opcaoData = {
            pergunta_id: opcao.pergunta_id,
            texto: opcao.texto,
            correta: opcao.correta,
            ordem: opcao.ordem
        };

        const result = await insertIntoTable('opcoes', opcaoData);
        return result[0] as Opcao;
    }

    async updateOpcao(opcao: Opcao): Promise<Opcao> {
        const { id, ...opcaoData } = opcao;
        
        const result = await updateTable('opcoes', opcaoData, { id });
        return result[0] as Opcao;
    }

    async deleteOpcao(id: number): Promise<void> {
        await deleteFromTable('opcoes', { id });
    }

    // Busca completa
    async findAtividadeCompleta(id: number): Promise<Atividade & { perguntas: (Pergunta & { opcoes: Opcao[] })[] } | null> {
        const atividade = await this.findAtividadeById(id);
        if (!atividade) return null;

        const perguntas = await this.findPerguntasByAtividade(id);
        
        const perguntasCompletas = await Promise.all(
            perguntas.map(async (pergunta) => {
                const opcoes = await this.findOpcoesByPergunta(pergunta.id!);
                return { ...pergunta, opcoes };
            })
        );

        return { ...atividade, perguntas: perguntasCompletas };
    }
} 