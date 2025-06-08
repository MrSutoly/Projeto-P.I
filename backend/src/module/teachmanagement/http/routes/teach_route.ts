import { Router } from 'express';
import { container } from 'tsyringe';
import { ActivityController } from '../controller/activity_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';

const teachRouter = Router();
const activityController = container.resolve(ActivityController);

// Middleware de autenticação
teachRouter.use(ensureAuthenticated);

// Rotas de atividades
teachRouter.post('/activities', (req, res) => activityController.create(req, res));
teachRouter.get('/activities', (req, res) => activityController.getAll(req, res));
teachRouter.get('/activities/:id', (req, res) => activityController.getById(req, res));
teachRouter.put('/activities/:id', (req, res) => activityController.update(req, res));
teachRouter.delete('/activities/:id', (req, res) => activityController.delete(req, res));

export default teachRouter; 