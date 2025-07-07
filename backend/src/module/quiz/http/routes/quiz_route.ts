import { Router, RequestHandler } from 'express';
import { container } from 'tsyringe';
import { QuizController } from '../controller/quiz_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';
import { ensureStudent } from '../../../auth/middleware/ensure_student';
import { AuthenticatedRequest } from '../../../../shared/types/express.d';

const quizRouter = Router();
const controller = container.resolve(QuizController);

// Handlers com tipagem correta
const createQuiz: RequestHandler = (req, res) => {
    return controller.createQuiz(req as AuthenticatedRequest, res);
};

const getAllQuizzes: RequestHandler = (req, res) => {
    return controller.getAllQuizzes(req, res);
};

const getQuizById: RequestHandler = (req, res) => {
    return controller.getQuizById(req, res);
};

const getQuizzesByTeacher: RequestHandler = (req, res) => {
    return controller.getQuizzesByTeacher(req as AuthenticatedRequest, res);
};

const getQuizzesByActivity: RequestHandler = (req, res) => {
    return controller.getQuizzesByActivity(req, res);
};

const updateQuiz: RequestHandler = (req, res) => {
    return controller.updateQuiz(req, res);
};

const deleteQuiz: RequestHandler = (req, res) => {
    return controller.deleteQuiz(req, res);
};

const submitResponse: RequestHandler = (req, res) => {
    return controller.submitResponse(req as AuthenticatedRequest, res);
};

const getQuizResults: RequestHandler = (req, res) => {
    return controller.getQuizResults(req as AuthenticatedRequest, res);
};

const getQuizStatistics: RequestHandler = (req, res) => {
    return controller.getQuizStatistics(req, res);
};

// Question handlers
const addQuestion: RequestHandler = (req, res) => {
    return controller.addQuestion(req, res);
};

const updateQuestion: RequestHandler = (req, res) => {
    return controller.updateQuestion(req, res);
};

const deleteQuestion: RequestHandler = (req, res) => {
    return controller.deleteQuestion(req, res);
};

// Option handlers
const addOption: RequestHandler = (req, res) => {
    return controller.addOption(req, res);
};

const updateOption: RequestHandler = (req, res) => {
    return controller.updateOption(req, res);
};

const deleteOption: RequestHandler = (req, res) => {
    return controller.deleteOption(req, res);
};

// Quiz CRUD routes
quizRouter.post('/quiz', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, createQuiz);
quizRouter.get('/quiz', getAllQuizzes);
quizRouter.get('/quiz/:id', getQuizById);

// Rota de teste sem autenticação
quizRouter.get('/test-quiz', (req, res) => {
    res.json({ message: 'Rota de teste funcionando!' });
});
quizRouter.get('/quiz/teacher/my-quizzes', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, getQuizzesByTeacher);
quizRouter.get('/quiz/activity/:activityId', getQuizzesByActivity);
quizRouter.put('/quiz/:id', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, updateQuiz);
quizRouter.delete('/quiz/:id', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, deleteQuiz);

// Quiz response routes
quizRouter.post('/quiz/response', ensureAuthenticated as RequestHandler, submitResponse);
quizRouter.get('/quiz/:quizId/results', ensureAuthenticated as RequestHandler, getQuizResults);
quizRouter.get('/quiz/:id/statistics', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, getQuizStatistics);

// Question management routes
quizRouter.post('/quiz/:quizId/question', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, addQuestion);
quizRouter.put('/quiz/question/:id', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, updateQuestion);
quizRouter.delete('/quiz/question/:id', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, deleteQuestion);

// Option management routes
quizRouter.post('/quiz/question/:questionId/option', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, addOption);
quizRouter.put('/quiz/option/:id', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, updateOption);
quizRouter.delete('/quiz/option/:id', ensureAuthenticated as RequestHandler, ensureTeacher as RequestHandler, deleteOption);

export { quizRouter }; 