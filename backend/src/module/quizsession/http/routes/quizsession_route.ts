import { Router, RequestHandler } from 'express';
import { container } from 'tsyringe';
import { QuizSessionController } from '../controller/session';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';
import { AuthenticatedRequest } from '../../../../shared/types/express';

const quizSessionRouter = Router();
const controller = container.resolve(QuizSessionController);

// Handlers com tipagem correta
const createSession: RequestHandler = (req, res) => {
    return controller.createSession(req as AuthenticatedRequest, res);
};

const joinSession: RequestHandler = (req, res) => {
    return controller.joinSession(req as AuthenticatedRequest, res);
};

const startSession: RequestHandler = (req, res) => {
    return controller.startSession(req as AuthenticatedRequest, res);
};

const submitAnswer: RequestHandler = (req, res) => {
    return controller.submitAnswer(req as AuthenticatedRequest, res);
};

const nextQuestion: RequestHandler = (req, res) => {
    return controller.nextQuestion(req as AuthenticatedRequest, res);
};

// Aplicando middlewares e handlers
quizSessionRouter.post('/session', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, createSession);
quizSessionRouter.post('/session/join', ensureAuthenticated as RequestHandler, joinSession);
quizSessionRouter.post('/session/:sessao_id/start', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, startSession);
quizSessionRouter.post('/session/:sessao_id/pergunta/:pergunta_id/answer', ensureAuthenticated as RequestHandler, submitAnswer);
quizSessionRouter.post('/session/:sessao_id/pergunta/:pergunta_id/next', ensureAuthenticated as RequestHandler, nextQuestion);

export default quizSessionRouter;