import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';
import { AppError } from '../../../../../shared/errors/AppError';

@injectable()
export class GetQuizController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async getAllQuizzes(req: Request, res: Response): Promise<Response> {
        try {
            const quizzes = await this.managementUseCase.findAllQuizzes();
            return res.json(quizzes);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno ao listar quizzes'
            });
        }
    }

    async getQuizById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const quiz = await this.managementUseCase.findQuizById(Number(id));
            
            if (!quiz) {
                return res.status(404).json({ message: 'Quiz não encontrado' });
            }

            return res.json(quiz);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno ao buscar quiz'
            });
        }
    }

    async getTeacherQuizzes(req: Request, res: Response): Promise<Response> {
        try {
            const teacherId = req.user?.id;
            
            if (!teacherId) {
                throw new AppError('Professor não autenticado', 401);
            }

            const quizzes = await this.managementUseCase.getTeacherQuizzes(teacherId);
            return res.json(quizzes);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno ao listar quizzes do professor'
            });
        }
    }

    async getClassQuizzes(req: Request, res: Response): Promise<Response> {
        try {
            const { classId } = req.params;
            const teacherId = req.user?.id;

            if (!teacherId) {
                throw new AppError('Professor não autenticado', 401);
            }

            const quizzes = await this.managementUseCase.findQuizzesByClass(Number(classId));
            return res.json(quizzes);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno ao listar quizzes da turma'
            });
        }
    }
}