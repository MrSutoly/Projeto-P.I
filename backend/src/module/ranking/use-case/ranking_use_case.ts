import { injectable, inject } from 'tsyringe';
import { IRankingRepository } from '../repository/i_ranking_repository';
import { TurmaRanking, AlunoRanking } from '../type/ranking_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class RankingUseCase {
    constructor(
        @inject('RankingRepository')
        private rankingRepository: IRankingRepository
    ) {}

    async getRankingGeral(): Promise<TurmaRanking[]> {
        const ranking = await this.rankingRepository.getRankingGeral();
        return ranking.map((turma, index) => ({
            ...turma,
            posicao: index + 1
        }));
    }

    async getMelhoresAlunos(limit?: number): Promise<AlunoRanking[]> {
        const ranking = await this.rankingRepository.getMelhoresAlunos(limit);
        return ranking.map((aluno, index) => ({
            ...aluno,
            posicao: index + 1
        }));
    }

    async getRankingTurma(turmaId: number): Promise<AlunoRanking[]> {
        if (!turmaId) {
            throw new AppError('ID da turma é obrigatório', 400);
        }

        const ranking = await this.rankingRepository.getRankingTurma(turmaId);
        return ranking.map((aluno, index) => ({
            ...aluno,
            posicao: index + 1
        }));
    }

    async getAlunoRanking(alunoId: number): Promise<AlunoRanking | null> {
        if (!alunoId) {
            throw new AppError('ID do aluno é obrigatório', 400);
        }

        return await this.rankingRepository.getAlunoRanking(alunoId);
    }
}
