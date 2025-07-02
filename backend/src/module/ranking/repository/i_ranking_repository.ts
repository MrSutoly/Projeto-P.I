import { TurmaRanking, AlunoRanking } from '../type/ranking_type';

export interface IRankingRepository {
    getRankingGeral(): Promise<TurmaRanking[]>;
    getMelhoresAlunos(limit?: number): Promise<AlunoRanking[]>;
    getRankingTurma(turmaId: number): Promise<AlunoRanking[]>;
    getAlunoRanking(alunoId: number): Promise<AlunoRanking | null>;
}