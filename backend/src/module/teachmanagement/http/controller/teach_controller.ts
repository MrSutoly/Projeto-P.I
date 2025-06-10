import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { TeachUseCase } from '../../use-case/teach_use_case';

@injectable()
export class TeachController {
    constructor(
        @inject(TeachUseCase)
        private teachUseCase: TeachUseCase
    ) {}

    async handleGetTeacherClasses(req: Request, res: Response): Promise<Response> {
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

    async handleGetTeacherQuizzes(req: Request, res: Response): Promise<Response> {
        try {
            const professor_id = req.user?.id;
            if (!professor_id) {
                return res.status(401).json({ message: 'Professor não autenticado' });
            }

            const quizzes = await this.teachUseCase.getTeacherQuizzes(professor_id);
            return res.json(quizzes);
        } catch (error: any) {
            return res.status(error.statusCode || 400).json({
                message: error.message
            });
        }
    }
}