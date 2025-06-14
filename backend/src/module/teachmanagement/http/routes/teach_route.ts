import { Router } from 'express';
import { container } from 'tsyringe';
import { TeachController } from '../controller/teach_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';

const teachRouter = Router();
const teachController = container.resolve(TeachController);

teachRouter.use(ensureAuthenticated);
teachRouter.use(ensureTeacher);

teachRouter.get('/teacher/classes', (req, res) => 
    teachController.handleGetTeacherClasses(req, res)
);

teachRouter.get('/quizzes', (req, res) => 
    teachController.handleGetAllQuizzes(req, res)
);

export default teachRouter;