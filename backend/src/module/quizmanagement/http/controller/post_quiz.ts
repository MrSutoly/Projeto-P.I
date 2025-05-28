import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { CreateQuizUseCase } from '../../use-case/quiz_use_case'; 

@injectable()
export class CreateQuizController {
    constructor(
        @inject(CreateQuizUseCase)
        private createQuizUseCase: CreateQuizUseCase
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { titulo, tipo, atividade_id, pergunta, opcoes } = req.body;

            const quiz = await this.createQuizUseCase.execute({
                titulo,
                tipo,
                atividade_id,
                pergunta,
                opcoes
            });

            return res.status(201).json(quiz);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao criar quiz'
            });
        }
    }
}