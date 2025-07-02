import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { IRankingRepository } from './i_ranking_repository';
import { TurmaRanking, AlunoRanking } from '../type/ranking_type';

@injectable()
export class RankingRepository implements IRankingRepository {
    async getRankingGeral(): Promise<TurmaRanking[]> {
        return await executeQuery<TurmaRanking[]>(`
            SELECT 
                t.id,
                t.nome,
                qmt.media_geral,
                qmt.total_quizzes,
                (
                    SELECT JSON_OBJECT(
                        'nome', u.nome,
                        'pontuacao', SUM(p.pontos)
                    )
                    FROM usuarios u
                    JOIN pontuacoes p ON u.id = p.aluno_id
                    WHERE u.class_id = t.id
                    GROUP BY u.id
                    ORDER BY SUM(p.pontos) DESC
                    LIMIT 1
                ) as melhor_aluno
            FROM turmas t
            JOIN quiz_medias_turma qmt ON t.id = qmt.turma_id
            ORDER BY qmt.media_geral DESC
        `);
    }

    async getMelhoresAlunos(limit: number = 10): Promise<AlunoRanking[]> {
        return await executeQuery<AlunoRanking[]>(`
            SELECT 
                u.id,
                u.nome,
                u.class_id as turma_id,
                t.nome as turma_nome,
                SUM(p.pontos) as pontuacao_total,
                COUNT(DISTINCT qs.quiz_id) as quizzes_realizados,
                AVG(p.pontos) as media
            FROM usuarios u
            JOIN pontuacoes p ON u.id = p.aluno_id
            JOIN quiz_sessions qs ON p.sessao_id = qs.id
            JOIN turmas t ON u.class_id = t.id
            WHERE u.role = 'aluno'
            GROUP BY u.id, u.nome, u.class_id, t.nome
            ORDER BY pontuacao_total DESC
            LIMIT ?
        `, [limit]);
    }

    async getRankingTurma(turmaId: number): Promise<AlunoRanking[]> {
        return await executeQuery<AlunoRanking[]>(`
            SELECT 
                u.id,
                u.nome,
                u.class_id as turma_id,
                t.nome as turma_nome,
                SUM(p.pontos) as pontuacao_total,
                COUNT(DISTINCT qs.quiz_id) as quizzes_realizados,
                AVG(p.pontos) as media
            FROM usuarios u
            JOIN pontuacoes p ON u.id = p.aluno_id
            JOIN quiz_sessions qs ON p.sessao_id = qs.id
            JOIN turmas t ON u.class_id = t.id
            WHERE u.class_id = ? AND u.role = 'aluno'
            GROUP BY u.id, u.nome
            ORDER BY pontuacao_total DESC
        `, [turmaId]);
    }

    async getAlunoRanking(alunoId: number): Promise<AlunoRanking | null> {
        const [aluno] = await executeQuery<AlunoRanking[]>(`
            SELECT 
                u.id,
                u.nome,
                u.class_id as turma_id,
                t.nome as turma_nome,
                SUM(p.pontos) as pontuacao_total,
                COUNT(DISTINCT qs.quiz_id) as quizzes_realizados,
                AVG(p.pontos) as media
            FROM usuarios u
            JOIN pontuacoes p ON u.id = p.aluno_id
            JOIN quiz_sessions qs ON p.sessao_id = qs.id
            JOIN turmas t ON u.class_id = t.id
            WHERE u.id = ? AND u.role = 'aluno'
            GROUP BY u.id, u.nome, u.class_id, t.nome
        `, [alunoId]);

        return aluno || null;
    }
}