import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';

@injectable()
export class DeleteQuizController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.managementUseCase.deleteQuiz(Number(id));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao deletar quiz'
            });
        }
    }
}