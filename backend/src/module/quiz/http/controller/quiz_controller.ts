import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { QuizUseCase } from '../../use-case/quiz_use_case';
import { AuthenticatedRequest } from '../../../../shared/types/express.d';
import { AppError } from '../../../../shared/errors/AppError';

@injectable()
export class QuizController {
    constructor(
        @inject(QuizUseCase)
        private quizUseCase: QuizUseCase
    ) {}

    async createQuiz(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const quizData = req.body;
            const quiz = await this.quizUseCase.createQuiz(quizData);
            return res.status(201).json(quiz);
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

    async getAllQuizzes(req: Request, res: Response): Promise<Response> {
        try {
            const quizzes = await this.quizUseCase.getAllQuizzes();
            return res.json(quizzes);
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

    async getQuizById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const quiz = await this.quizUseCase.getQuizById(Number(id));
            
            if (!quiz) {
                return res.status(404).json({
                    message: 'Quiz não encontrado'
                });
            }

            return res.json(quiz);
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

    async getQuizzesByTeacher(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const teacherId = req.user?.id;
            
            if (!teacherId) {
                return res.status(401).json({
                    message: 'Professor não autenticado'
                });
            }

            const quizzes = await this.quizUseCase.getQuizzesByTeacher(teacherId);
            return res.json(quizzes);
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

    async getQuizzesByActivity(req: Request, res: Response): Promise<Response> {
        try {
            const { activityId } = req.params;
            const quizzes = await this.quizUseCase.getQuizzesByActivity(Number(activityId));
            return res.json(quizzes);
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

    async updateQuiz(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const quizData = req.body;
            const quiz = await this.quizUseCase.updateQuiz(Number(id), quizData);
            return res.json(quiz);
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

    async deleteQuiz(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.quizUseCase.deleteQuiz(Number(id));
            return res.status(204).send();
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

    async submitResponse(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { quizId, questionId, optionId } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    message: 'Usuário não autenticado'
                });
            }

            const response = await this.quizUseCase.submitResponse(
                userId,
                quizId,
                questionId,
                optionId
            );

            return res.status(201).json(response);
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

    async getQuizResults(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { quizId } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    message: 'Usuário não autenticado'
                });
            }

            const results = await this.quizUseCase.getQuizResults(userId, Number(quizId));
            return res.json(results);
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

    async getQuizStatistics(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const statistics = await this.quizUseCase.getQuizStatistics(Number(id));
            return res.json(statistics);
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

    // Question Management
    async addQuestion(req: Request, res: Response): Promise<Response> {
        try {
            const { quizId } = req.params;
            const questionData = req.body;
            const question = await this.quizUseCase.addQuestion(Number(quizId), questionData);
            return res.status(201).json(question);
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

    async updateQuestion(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const questionData = req.body;
            const question = await this.quizUseCase.updateQuestion(Number(id), questionData);
            return res.json(question);
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

    async deleteQuestion(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.quizUseCase.deleteQuestion(Number(id));
            return res.status(204).send();
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

    // Option Management
    async addOption(req: Request, res: Response): Promise<Response> {
        try {
            const { questionId } = req.params;
            const optionData = req.body;
            const option = await this.quizUseCase.addOption(Number(questionId), optionData);
            return res.status(201).json(option);
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

    async updateOption(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const optionData = req.body;
            const option = await this.quizUseCase.updateOption(Number(id), optionData);
            return res.json(option);
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

    async deleteOption(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.quizUseCase.deleteOption(Number(id));
            return res.status(204).send();
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