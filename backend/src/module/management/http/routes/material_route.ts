import { Router } from 'express';
import { container } from 'tsyringe';
import { MaterialController } from '../controller/material/material_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';

const materialRouter = Router();
const materialController = container.resolve(MaterialController);

// Todas as rotas precisam de autenticação
materialRouter.use(ensureAuthenticated);

// Rotas públicas (para usuários autenticados)
materialRouter.get('/materials', (req, res) => 
    materialController.getAllMaterials(req, res));

materialRouter.get('/materials/:id', (req, res) => 
    materialController.getMaterialById(req, res));

materialRouter.get('/materials/semana/:semana', (req, res) => 
    materialController.getMaterialsBySemana(req, res));

materialRouter.get('/materials/tipo/:tipo', (req, res) => 
    materialController.getMaterialsByTipo(req, res));

// Rotas protegidas (apenas professores)
materialRouter.post('/materials', ensureTeacher, (req, res) => 
    materialController.createMaterial(req, res));

materialRouter.put('/materials/:id', ensureTeacher, (req, res) => 
    materialController.updateMaterial(req, res));

materialRouter.delete('/materials/:id', ensureTeacher, (req, res) => 
    materialController.deleteMaterial(req, res));

export default materialRouter; 