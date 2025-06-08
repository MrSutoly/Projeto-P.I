import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { SubmitQuizUseCase } from '../../use-case/submit_quiz_use_case';

@injectable()
export class SubmitQuizController {
    constructor(
        @inject(SubmitQuizUseCase)
        private submitQuizUseCase: SubmitQuizUseCase
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { quiz_id, respostas } = req.body;
            const user_id = req.user?.id;

            if (!user_id) {
                return res.status(401).json({ message: 'Usuário não autenticado' });
            }

            const result = await this.submitQuizUseCase.execute({
                user_id,
                quiz_id,
                respostas
            });

            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao submeter quiz'
            });
        }
    }
}