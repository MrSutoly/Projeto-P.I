import { Router } from 'express';
import { container } from 'tsyringe';
import { GetQuizController } from '../controller/get_quiz';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';

const quizShowRouter = Router();
const getQuizController = container.resolve(GetQuizController);

quizShowRouter.use(ensureAuthenticated);

quizShowRouter.get('/quiz/:id', (req, res) => getQuizController.getQuizById(req, res));
quizShowRouter.get('/quiz', (req, res) => getQuizController.getAllQuizzes(req, res));

export default quizShowRouter;