import { injectable, inject } from 'tsyringe';
import { Response } from 'express';
import { RankingUseCase } from '../../use-case/ranking_use_case';
import { AuthenticatedRequest } from '../../../../shared/types/express';
import { AppError } from '../../../../shared/errors/AppError';

@injectable()
export class RankingController {
    constructor(
        @inject(RankingUseCase)
        private rankingUseCase: RankingUseCase
    ) {}

    async handleGetRankingGeral(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const ranking = await this.rankingUseCase.getRankingGeral();
            return res.json(ranking);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }

    async handleGetMelhoresAlunos(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : undefined;
            const ranking = await this.rankingUseCase.getMelhoresAlunos(limit);
            return res.json(ranking);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }

    async handleGetRankingTurma(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { turmaId } = req.params;
            const ranking = await this.rankingUseCase.getRankingTurma(Number(turmaId));
            return res.json(ranking);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }

    async handleGetAlunoRanking(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { alunoId } = req.params;
            const ranking = await this.rankingUseCase.getAlunoRanking(Number(alunoId));
            return res.json(ranking);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }
}