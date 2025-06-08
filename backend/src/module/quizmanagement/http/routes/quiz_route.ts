import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateQuizController } from '../controller/post_quiz';
import { GetQuizController } from '../controller/get_quiz';
import { SubmitQuizController } from '../controller/submit_quiz';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureAdmin } from '../../../auth/middleware/ensure_admin';

const quizRouter = Router();
const createQuizController = container.resolve(CreateQuizController);
const getQuizController = container.resolve(GetQuizController);
const submitQuizController = container.resolve(SubmitQuizController);

// Public routes
quizRouter.get('/quiz', (req, res) => getQuizController.getAllQuizzes(req, res));
quizRouter.get('/quiz/:id', (req, res) => getQuizController.getQuizById(req, res));

// Protected routes
quizRouter.use(ensureAuthenticated);
quizRouter.post('/quiz', ensureAdmin, (req, res) => createQuizController.handle(req, res));
quizRouter.post('/quiz/:id/submit', (req, res) => submitQuizController.handle(req, res));

export default quizRouter;