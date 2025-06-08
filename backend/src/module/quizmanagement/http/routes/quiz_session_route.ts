import { Router } from 'express';
import { container } from 'tsyringe';
import { QuizSessionController } from '../controllers/quiz_session_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';
import { ensureStudent } from '../../../auth/middleware/ensure_student';

const quizSessionRouter = Router();
const quizSessionController = container.resolve(QuizSessionController);

// Rotas protegidas por autenticação
quizSessionRouter.use(ensureAuthenticated);

// Rotas para professores
quizSessionRouter.post('/start', ensureTeacher, quizSessionController.startSession);
quizSessionRouter.post('/:sessao_id/next', ensureTeacher, quizSessionController.nextQuestion);
quizSessionRouter.get('/:sessao_id/students', ensureTeacher, quizSessionController.getConnectedStudents);

// Rotas para alunos
quizSessionRouter.post('/answer', ensureStudent, quizSessionController.submitAnswer);

// Rotas públicas (apenas autenticação)
quizSessionRouter.get('/code/:codigo', quizSessionController.getSessionByCode);

export { quizSessionRouter }; 