/// <reference path="../../../../@types/express/index.d.ts" />
import { injectable, inject } from 'tsyringe';
import { Response } from 'express';
import { TeachUseCase } from '../../use-case/teach_use_case';
import { AuthenticatedRequest } from '../../../../shared/types/express';

@injectable()
export class TeachController {
    constructor(
        @inject(TeachUseCase)
        private teachUseCase: TeachUseCase
    ) {}

    async handleGetTeacherClasses(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const professor_id = req.user?.id;
            if (!professor_id) {
                return res.status(401).json({ message: 'Professor não autenticado' });
            }

            const classes = await this.teachUseCase.getTeacherClasses(professor_id);
            return res.json(classes);
        } catch (error: any) {
            return res.status(error.statusCode || 400).json({
                message: error.message
            });
        }
    }

    async handleGetAllQuizzes(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const quizzes = await this.teachUseCase.getAllQuizzes();
            return res.json(quizzes);
        } catch (error: any) {
            return res.status(error.statusCode || 400).json({
                message: error.message
            });
        }
    }
}