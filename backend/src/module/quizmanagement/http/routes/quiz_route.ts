import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateQuizController } from '../controller/post_quiz';
import { GetQuizController } from '../controller/get_quiz';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';

const quizRouter = Router();
const createQuizController = container.resolve(CreateQuizController);
const getQuizController = container.resolve(GetQuizController);

quizRouter.use(ensureAuthenticated);

quizRouter.post('/quiz', (req, res) => createQuizController.handle(req, res));
quizRouter.get('/quiz', (req, res) => getQuizController.getAllQuizzes(req, res));
quizRouter.get('/quiz/:id', (req, res) => getQuizController.getQuizById(req, res));

export default quizRouter;