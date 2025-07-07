import { Router, Response, RequestHandler } from 'express';
import { container } from 'tsyringe';
import { TeachController } from '../controller/teach_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';
import { AuthenticatedRequest } from '../../../../shared/types/express';

const teachRouter = Router();
const teachController = container.resolve(TeachController);

// Aplicando middlewares globalmente para todas as rotas deste router
teachRouter.use(ensureAuthenticated as RequestHandler);
teachRouter.use(ensureTeacher as RequestHandler);

const getTeacherClasses: RequestHandler = (req, res) => {
    return teachController.handleGetTeacherClasses(req as AuthenticatedRequest, res);
};

const getAllQuizzes: RequestHandler = (req, res) => {
    return teachController.handleGetAllQuizzes(req as AuthenticatedRequest, res);
};

teachRouter.get('/teacher/classes', getTeacherClasses);
teachRouter.get('/quizzes', getAllQuizzes);

export default teachRouter;