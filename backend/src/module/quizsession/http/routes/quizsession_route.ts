import { Router } from 'express';
import { container } from 'tsyringe';
import { QuizSessionController } from '../controller/quizsession_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';

const quizSessionRouter = Router();
const controller = container.resolve(QuizSessionController);

quizSessionRouter.post('/session', ensureAuthenticated, (req, res) => controller.createSession(req, res));
quizSessionRouter.post('/session/join', ensureAuthenticated, (req, res) => controller.joinSession(req, res));
quizSessionRouter.post('/session/:sessao_id/start', ensureAuthenticated, (req, res) => controller.startSession(req, res));
quizSessionRouter.post('/session/:sessao_id/pergunta/:pergunta_id/answer', ensureAuthenticated, (req, res) => controller.submitAnswer(req, res));
quizSessionRouter.post('/session/:sessao_id/pergunta/:pergunta_id/next', ensureAuthenticated, (req, res) => controller.nextQuestion(req, res));

export default quizSessionRouter;