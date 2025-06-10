import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';

@injectable()
export class CreateQuizController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const quizData = req.body;
            const quiz = await this.managementUseCase.createQuiz(quizData);
            return res.status(201).json(quiz);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao criar quiz'
            });
        }
    }
}