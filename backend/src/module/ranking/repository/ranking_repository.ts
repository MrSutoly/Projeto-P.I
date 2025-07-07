import { injectable } from 'tsyringe';
import { selectFromTable, findOne } from '../../../shared/database/supabase/db';
import { IRankingRepository } from './i_ranking_repository';
import { TurmaRanking, AlunoRanking } from '../type/ranking_type';

@injectable()
export class RankingRepository implements IRankingRepository {
    async getRankingGeral(): Promise<TurmaRanking[]> {
        // Usar a tabela ranking_turmas que já existe no Supabase
        return await selectFromTable<TurmaRanking>('ranking_turmas');
    }

    async getMelhoresAlunos(limit: number = 10): Promise<AlunoRanking[]> {
        // Usar a tabela ranking_alunos que já existe no Supabase
        const rankings = await selectFromTable<any>('ranking_alunos');
        return rankings.slice(0, limit);
    }

    async getRankingTurma(turmaId: number): Promise<AlunoRanking[]> {
        // Buscar alunos da turma específica
        return await selectFromTable<AlunoRanking>('ranking_alunos', '*', { turma_id: turmaId });
    }

    async getAlunoRanking(alunoId: number): Promise<AlunoRanking | null> {
        // Buscar ranking específico do aluno
        return await findOne<AlunoRanking>('ranking_alunos', { aluno_id: alunoId });
    }
}