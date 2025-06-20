import { injectable, inject } from 'tsyringe';
import { Response } from 'express';
import { RecyclingUseCase } from '../../use-case/recycling_use_case';
import { AuthenticatedRequest } from '../../../../shared/types/express.d';

@injectable()
export class RecyclingController {
    constructor(
        @inject(RecyclingUseCase)
        private recyclingUseCase: RecyclingUseCase
    ) {}

    async addPoints(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { turma_id, pontos, motivo } = req.body;
        const professor_id = req.user!.id;

        const entry = await this.recyclingUseCase.addPointsToClass({
            turma_id,
            professor_id,
            pontos,
            motivo,
        });

        return res.status(201).json(entry);
    }
} 