import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { IQuizRepository } from '../../repository/i_quiz_repository';

@injectable()
export class GetQuizController {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository
    ) {}

    async getAllQuizzes(req: Request, res: Response): Promise<Response> {
        try {
            const quizzes = await this.quizRepository.findAllQuizzes();
            return res.json(quizzes);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao listar quizzes'
            });
        }
    }

    async getQuizById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const quiz = await this.quizRepository.findFullQuizById(Number(id));
            
            if (!quiz) {
                return res.status(404).json({ message: 'Quiz não encontrado' });
            }

            return res.json(quiz);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao buscar quiz'
            });
        }
    }
}