import { Router } from 'express';
import { container } from 'tsyringe';
import { GetQuizController } from '../controller/quiz/get_quiz';
import { CreateQuizController } from '../controller/quiz/post_quiz';
import { DeleteQuizController } from '../controller/quiz/delete_quiz';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';
import { ensureAdmin } from '../../../auth/middleware/ensure_admin';

const quizRouter = Router();

// Controller instances
const getQuizController = container.resolve(GetQuizController);
const createQuizController = container.resolve(CreateQuizController);
const deleteQuizController = container.resolve(DeleteQuizController);

// Quiz routes
quizRouter.use(ensureAuthenticated);

quizRouter.get('/quizzes', (req, res) => 
    getQuizController.getAllQuizzes(req, res));

quizRouter.get('/quizzes/:id', (req, res) => 
    getQuizController.getQuizById(req, res));

quizRouter.post('/quizzes', ensureAdmin, (req, res) => 
    createQuizController.handle(req, res));

quizRouter.delete('/quizzes/:id', ensureAdmin, (req, res) => 
    deleteQuizController.handle(req, res));

quizRouter.get('/teacher/quizzes', ensureTeacher, (req, res) => 
    getQuizController.getTeacherQuizzes(req, res));

quizRouter.get('/teacher/class/:classId/quizzes', ensureTeacher, (req, res) => 
    getQuizController.getClassQuizzes(req, res));

export default quizRouter;